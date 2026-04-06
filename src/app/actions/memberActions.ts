'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";
import { Member } from "@prisma/client";



export async function getMembers({
    ageRange = '18,100',
    gender = 'male,female',
    pageNumber = '1',
    pageSize = '12',
    orderBy = 'updated',
    withPhoto = 'true'
}: GetMemberParams): Promise<PaginatedResponse<Member>> {

    const userId = await getAuthUserId();

    const [MinAge, MaxAge] = ageRange.split(',');
    const currentDate = new Date();
    const minDob = addYears(currentDate, -MaxAge - 1);
    const maxDob = addYears(currentDate, -MinAge);

    const selectedGender = gender.split(',');

    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);

    const skip = (page - 1) * limit;

    try {
        const count = await prisma.member.count({
             where: {
                AND: [
                  {dateOfBirth: {gte: minDob,lte: maxDob}},
                  {gender: {in: selectedGender}},
                  ...(withPhoto === 'true' ? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
        })

        const members = await prisma.member.findMany({
            where: {
                AND: [
                  {dateOfBirth: {gte: minDob,lte: maxDob}},
                  {gender: {in: selectedGender}},
                  ...(withPhoto === 'true' ? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
            orderBy: {[orderBy]: 'desc'},
            skip,
            take: limit
        });

        return {
            items: members,
            totalCount: count
        }

    } catch (error) {
        console.log(error);
         throw error;
    }
}

export async function getMemberByUserId(userId: string) {
    try {
        return prisma.member.findUnique({ where: { userId } })
    } catch (error) {
        console.log(error);
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const member = await prisma.member.findUnique({
        where: { userId },
        select: { photos: true }
    });

    if (!member) return null;

    return member.photos


}


export async function updateLastActive() {
    const userId = await getAuthUserId();
    
    try {
        return prisma.member.update({
            where: { userId },
            data: { updated: new Date() }
        })
        
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
