// /app/api/user/register/route.ts
//処理は動いたが、サインアップ後、ログインされない仕様である事が判明し、不採用
//ログインまで実装する場合は、カスタムトークン処理が必要
//例えば、 const customToken = await getAuth().createCustomToken(userCredential.uid);


import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userCredential = await getAuth().createUser({
      email: email,
      password: password,
    });

    return NextResponse.json({
      message: "User Register successful",
      user: userCredential.email,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
