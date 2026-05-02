import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const invite = await prisma.invite.findUnique({
    where: { token: params.token },
    include: {
      workspace: { select: { id: true, name: true, slug: true, icon: true } },
      creator: { select: { id: true, name: true, email: true } },
    },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  if (invite.used) {
    return NextResponse.json({ error: "Invite has already been used" }, { status: 410 });
  }

  return NextResponse.json(invite);
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const invite = await prisma.invite.findUnique({
    where: { token: params.token },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  if (invite.used) {
    return NextResponse.json({ error: "Invite has already been used" }, { status: 410 });
  }

  const existing = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId: invite.workspaceId, userId: session.user.id },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You are already a member of this workspace" },
      { status: 409 }
    );
  }

  const membership = await prisma.workspaceMember.create({
    data: {
      workspaceId: invite.workspaceId,
      userId: session.user.id,
      role: "MEMBER",
    },
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { used: true, usedAt: new Date(), acceptedBy: session.user.id },
  });

  return NextResponse.json({ membership, workspaceId: invite.workspaceId }, { status: 201 });
}
