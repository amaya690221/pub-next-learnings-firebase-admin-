//  /app/api/records/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";
import { authenticateRequest } from "../../utils/authRequest"; 

// **データ更新**
export async function PUT(request: NextRequest) {
  const body: StudyData = await request.json();

  if (!body.id || !body.email || !body.title || body.time === undefined) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // トークンの検証を実施
    const decodedToken = await authenticateRequest(request);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "認証できません: トークンが不正です" },
        { status: 401 }
      );
    }

    const docRef = doc(db, collectionName, body.id);
    await updateDoc(docRef, { title: body.title, time: body.time });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
