'use server'

import fs from 'fs/promises';
import path from 'path';
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import Papa from 'papaparse';

// Function to read crafting data from CSV
const readCraftingData = async (): Promise<string> => {
    const filePath = path.join(process.cwd(), 'public', 'data', 'crafting.csv');
    const csvText = await fs.readFile(filePath, 'utf-8');

    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            complete: (results) => {
                const filteredData = results.data.map((row: any) => {
                    const { Aspect, 'Result Aspects': resultAspects, ...rest } = row;
                    return rest;
                });

                const newCsv = Papa.unparse(filteredData);
                resolve(newCsv);
            },
            error: (error: any) => {
                console.error('Error parsing CSV:', error);
                reject(error);
            }
        });
    });
};

const user_prompt = "Assuming I don't have any previous item, how can I craft {item_name}?\n Explain step by step including why the item is needed.Dont return an intro."
const field_description = "Item: item name, level: complexity of the recipe, required skill: skill to use to craft, extra requirements: what extra ingredients are needed"


// Generate crafting info using OpenAI
export const generateCraftingInfoWithOpenAI = async (item_name: string): Promise<string> => {
    const craftingData = await readCraftingData();
    const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
        maxTokens: undefined,
        timeout: undefined,
        maxRetries: 2,
        apiKey: process.env.OPENAI_API_KEY,
        // other params...
      });
      
      const inputText = `this is the crafting guide of the videogame Book Of Hours: ${craftingData} \n\n each CSV row is a recipe.
      the fields of the CSV are: ${field_description}. ${user_prompt.replace("{item_name}", item_name)}`
      const completion = await llm.invoke(inputText);
      return completion.content
      
};

// Generate crafting info using Anthropic
export const generateCraftingInfoWithAnthropic = async (item_name: string): Promise<string> => {

    console.log("Generating crafting info with Anthropic for item: ", item_name)
    const craftingData = await readCraftingData();
    const model = new ChatAnthropic({
        model: "claude-3-5-sonnet-20240620",
        temperature: 0,
        maxRetries: 2,
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful crafting assistant. You are given a list of crafting recipes and a target item. You need to return the crafting info for the target item.Do not invent anything, only use the provided data."],
        ["human", `Crafting Data:\n{craftingData}\n \nThe fields of the crafting data are: {fields}.\n\n when producing the answer always consider at most one line of the input data. {user_prompt}`],
    ]);

    const chain = prompt.pipe(model);
    const response = await chain.invoke(
        {
            craftingData: craftingData,
            item_name: item_name,
            fields: field_description,
            user_prompt: user_prompt.replace("{item_name}", item_name)
        }
    );  
      

    return response.content as string; // Return the generated response
};
