import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { membership, response: memberResponse } = await requireRole(params.id, session.user.id, "MEMBER");
  if (memberResponse) return memberResponse;

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { membership, response: memberResponse } = await requireRole(params.id, session.user.id, "ADMIN");
  if (memberResponse) return memberResponse;

  const body = await req.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role are required" },
      { status: 400 }
    );
  }

  const target = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: params.id, userId } },
  });

  if (!target) {
    return NextResponse.json(
      { error: "User is not a member of this workspace" },
      { status: 404 }
    );
  }

  if (target.role === "OWNER") {
    return NextResponse.json(
      { error: "Cannot change the owner's role" },
      { status: 403 }
    );
  }

  const updated = await prisma.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId: params.id, userId } },
    data: { role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    );
  }

  const { membership, response: memberResponse } = await requireRole(params.id, session.user.id, "ADMIN");
  if (memberResponse) return memberResponse;

  const target = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: params.id, userId } },
  });

  if (!target) {
    return NextResponse.json(
      { error: "User is not a member of this workspace" },
      { status: 404 }
    );
  }

  if (target.role === "OWNER") {
    return NextResponse.json(
      { error: "Cannot remove the owner" },
      { status: 403 }
    );
  }

  await prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId: params.id, userId } },
  });

  return NextResponse.json({ message: "Member removed successfully" });
}
