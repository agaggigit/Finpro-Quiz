import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { email, username, password } = body;

        //check if email already exist
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if(existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 })
        }

        //check if username already exist
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        });
        if(existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 409 })
        }

        //create variable for encrypt password
        const hashedPassword = await hash(password, 10);

        // store data to database
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })
        

        return NextResponse.json({ user: newUser, message: "User created succesfully"}, { status: 201 });
    } catch(error) {

    }
}