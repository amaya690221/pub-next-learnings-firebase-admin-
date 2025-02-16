//  /app/api/records/create/route.ts
import { NextRequest, NextResponse } from "next/server"; 
import { addDoc, collection } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";
import { authenticateRequest } from "../../utils/authRequest";

// **データ追加**
export async function POST(request: NextRequest) {
  //NextRequestに変更
  const body: StudyData = await request.json();

  if (!body.email || !body.title || body.time === undefined) {
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

    const studiesRef = collection(db, collectionName);
    const docRef = await addDoc(studiesRef, body);
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
