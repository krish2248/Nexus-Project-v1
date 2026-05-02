import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: { userId: session.user.id },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      _count: {
        select: { spaces: true, members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(workspaces);
}

export async function POST(req: Request) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const body = await req.json();
  const { name, slug, description, icon } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.workspace.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "Workspace with this slug already exists" },
      { status: 409 }
    );
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      description: description || null,
      icon: icon || null,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
    },
  });

  return NextResponse.json(workspace, { status: 201 });
}
