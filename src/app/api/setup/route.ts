import { NextResponse } from "next/server";
import getOrCreateDB from "@/models/server/dbSetup";
import getOrCreateStorage from "@/models/server/storageSetup";

export async function GET() {
    try {
        await Promise.all([
            getOrCreateDB(),
            getOrCreateStorage()
        ]);

        return NextResponse.json({ success: true, message: "Database & Storage setup completed" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
