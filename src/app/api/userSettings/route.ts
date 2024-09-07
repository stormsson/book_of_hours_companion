import { NextRequest, NextResponse } from "next/server";
import { getFirstUserSettings, setUserSettings } from "@/utils/mongoUtils";
import { ObjectId } from "mongodb";
import { DBUserSettings } from "@/types";

const defaultSettings: DBUserSettings = {
  known_books: [],
  known_craftable_items: [],
  options: {
    isSimplifiedView: false
  }
};

export async function GET(request: NextRequest) {
  try {
    let userSettings = await getFirstUserSettings();
    
    if (!userSettings) {
      // If no settings found, create and save default settings
      userSettings = defaultSettings;
      const result = await setUserSettings(new ObjectId().toString(), userSettings);
      if (!result) {
        throw new Error("Failed to create default user settings");
      }
    }
    
    return NextResponse.json(userSettings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error fetching or creating user settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings: DBUserSettings = await request.json();
    if (!settings._id) {
      throw new Error("Settings ID is required for updates");
    }
    const result = await setUserSettings(new ObjectId(settings._id).toString(), settings);
    if (!result) {
      throw new Error("Failed to update user settings");
    }
    return NextResponse.json({ message: 'Settings updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error updating user settings: ' + error.message }, { status: 500 });
  }
}