//app/api/admin/auth/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // 1. 타입 검증 (Type Confusion 차단)
    if (typeof password !== "string") {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    // 2. 비밀번호 비교 (환경변수 미설정 대비 예외 처리 포함)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password.trim() !== adminPassword.trim()) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 3. 인증 성공 시 Secure / HttpOnly 쿠키 발급
    const response = NextResponse.json({ success: true });

    // 보안 쿠키 설정 (자바스크립트로 접근 불가, HTTPS에서만 전송)
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2시간 유효
      path: "/",
    });

    return response;

  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}