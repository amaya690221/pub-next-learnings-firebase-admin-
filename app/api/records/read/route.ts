//  /app/api/records/read/route.ts
import { NextRequest, NextResponse } from "next/server"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";
import { authenticateRequest } from "../../utils/authRequest"; 

// **データ取得**
export async function GET(request: NextRequest) {

  try {
    // トークンの検証を実施
    const decodedToken = await authenticateRequest(request);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "認証できません: トークンが不正です" },
        { status: 401 }
      );
    }
    console.log("decodedToken: ", decodedToken);
    const email = decodedToken.email; // トークンからemailを取得

    const studiesRef = collection(db, collectionName);
    const q = query(studiesRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    const data: StudyData[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as StudyData)
    );

    console.log("GET:", data);
    return NextResponse.json({ success: true, data }, { status: 200 });
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
