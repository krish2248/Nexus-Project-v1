import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, user: session.user, response: null };
}

export async function requireWorkspaceMember(
  workspaceId: string,
  userId: string
) {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
    include: { workspace: true },
  });

  if (!membership) {
    return {
      response: NextResponse.json(
        { error: "You are not a member of this workspace" },
        { status: 403 }
      ),
    };
  }

  return { membership, response: null };
}

export async function requireRole(
  workspaceId: string,
  userId: string,
  requiredRole: Role
) {
  const { membership, response } = await requireWorkspaceMember(
    workspaceId,
    userId
  );

  if (response) return { response };

  const roleHierarchy = { VIEWER: 0, MEMBER: 1, ADMIN: 2, OWNER: 3 } as const;

  if (roleHierarchy[membership!.role] < roleHierarchy[requiredRole]) {
    return {
      response: NextResponse.json(
        { error: `Requires ${requiredRole.toLowerCase()} role or higher` },
        { status: 403 }
      ),
    };
  }

  return { membership, response: null };
}
