import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { membership, response: memberResponse } = await requireRole(params.id, session.user.id, "MEMBER");
  if (memberResponse) return memberResponse;

  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.invite.create({
    data: {
      token,
      workspaceId: params.id,
      createdBy: session.user.id,
      expiresAt,
      email: email || null,
    },
  });

  const inviteUrl = `${process.env.NEXTAUTH_URL}/invites/${token}`;

  return NextResponse.json({ invite, inviteUrl }, { status: 201 });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const invites = await prisma.invite.findMany({
    where: { workspaceId: params.id },
    include: { creator: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invites);
}
