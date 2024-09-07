import "server-only";
// EXTERNAL LIBRARIES
import {
  MongoClient,
  ClientSession,
  ServerApiVersion,
  WithId,
  ObjectId,
  Collection,
  InsertOneResult,
  UpdateResult,
  Document,
  InsertManyResult,
} from "mongodb";

//=== NEXT-REACT

//=== PROJECT
import { IGenericObject } from "../types";

//=== CONSTANTS
const dbName = process.env.MONGO_DB;

const COLLECTION_OPTIONS = "options";
const COLLECTION_USER_SETTINGS = "user_settings";

//=== INTERFACES

import { DBOption, DBUserSettings } from "../types";
//   type DBTagPresave = Omit<DBTag, 'created_at' | 'last_use' | '_id' >;


//==============

const _initMongoClient = (): MongoClient => {
  const uri = process.env.MONGO_URI || "";

  const mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });

  return mongoClient;
};

const getClient = (): MongoClient => {
  return _initMongoClient();
};

//=== GET THINGS

export const getOption = async (
  option_name: string
): Promise<DBOption | null> => {
  const client = getClient();

  const collection: Collection = client
    .db(dbName)
    .collection(COLLECTION_OPTIONS);

  let result: DBOption | null = null;

  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    result = (await collection.findOne({
      option_name: option_name,
    })) as DBOption | null;
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return result;
};


export const setOption = async (
  option_name: string,
  option_value: string | string[]
): Promise<boolean> => {
  const client = getClient();

  const collection: Collection = client
    .db(dbName)
    .collection(COLLECTION_OPTIONS);

  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await collection.updateOne(
      { option_name: option_name },
      {
        $set: { option_value },
      },
      { upsert: true }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

//=== GET USER SETTINGS

export const getUserSettings = async (
  userId: string
): Promise<DBUserSettings | null> => {
  const client = getClient();

  const collection: Collection = client
    .db(dbName)
    .collection(COLLECTION_USER_SETTINGS);

  let result: DBUserSettings | null = null;

  try {
    await client.connect();
    result = (await collection.findOne({
      _id: new ObjectId(userId),
    })) as DBUserSettings | null;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }

  return result;
};



//=== SET USER SETTINGS

export const setUserSettings = async (
  userId: string,
  settings: DBUserSettings
): Promise<boolean> => {
  const client = getClient();

  delete settings._id;

  const collection: Collection = client
    .db(dbName)
    .collection(COLLECTION_USER_SETTINGS);

  try {
    await client.connect();
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: settings,
      },
      { upsert: true }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.close();
  }
};

//=== GET FIRST USER SETTINGS

export const getFirstUserSettings = async (): Promise<DBUserSettings | null> => {
  const client = getClient();

  const collection: Collection = client
    .db(dbName)
    .collection(COLLECTION_USER_SETTINGS);

  let result: DBUserSettings | null = null;

  try {
    await client.connect();
    result = (await collection.findOne({})) as DBUserSettings | null; // Retrieves the first document
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }

  return result;
};
