import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      spaces: {
        include: {
          channels: true,
        },
      },
      featureGates: true,
    },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  return NextResponse.json(workspace);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const workspace = await prisma.workspace.findFirst({
    where: { id: params.id, members: { some: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } } } },
  });

  if (!workspace) {
    return NextResponse.json(
      { error: "Not authorized to edit this workspace" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, slug, description, icon } = body;

  if (slug && slug !== workspace.slug) {
    const existing = await prisma.workspace.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Another workspace with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.workspace.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
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

  const workspace = await prisma.workspace.findFirst({
    where: { id: params.id, ownerId: session.user.id },
  });

  if (!workspace) {
    return NextResponse.json(
      { error: "Only the workspace owner can delete it" },
      { status: 403 }
    );
  }

  await prisma.workspace.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Workspace deleted successfully" });
}
