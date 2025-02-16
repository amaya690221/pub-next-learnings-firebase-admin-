//  /app/api/records/delete/route.ts
import { NextRequest, NextResponse } from "next/server"; 
import { deleteDoc, doc } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";
import { authenticateRequest } from "../../utils/authRequest";

// **データ削除**
export async function DELETE(request: NextRequest) {
  const body: StudyData = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
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
    await deleteDoc(docRef);
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
