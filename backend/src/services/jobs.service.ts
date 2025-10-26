import prisma from "../prisma/client";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import appAssert from "../utils/appAssert";

// Struktur field minimum profile
type ProfileFieldStatus = "MANDATORY" | "OPTIONAL" | "OFF";

interface ProfileRequirements {
    fullName: ProfileFieldStatus;
    photoProfile: ProfileFieldStatus;
    gender: ProfileFieldStatus;
    domicile: ProfileFieldStatus;
    email: ProfileFieldStatus;
    phoneNumber: ProfileFieldStatus;
    linkedinLink: ProfileFieldStatus;
    dateOfBirth: ProfileFieldStatus;
}

interface JobPayload {
    jobName: string;
    jobType: string;
    jobDescription: string;
    numberOfCandidateNeeded: number;
    minimumSalary: string;
    maximumSalary: string;
    minimumProfileInformationRequired: ProfileRequirements;
}

export const createJobService = async (userId: string, payload: JobPayload) => {
    try {
        const newJob = await prisma.job.create({
            data: {
                jobName: payload.jobName,
                jobType: payload.jobType,
                jobDescription: payload.jobDescription,
                numberOfCandidateNeeded: payload.numberOfCandidateNeeded,
                minimumSalary: payload.minimumSalary,
                maximumSalary: payload.maximumSalary,
                minimumProfileInformationRequired:
                    payload.minimumProfileInformationRequired as unknown as object,
                createdBy: userId,
            },
        });
        return newJob;
    } catch (error) {
        console.error("Error creating job:", error);
        appAssert(false, INTERNAL_SERVER_ERROR, "Failed to create job");
    }
};

export const updateJobService = async (jobId: string, payload: JobPayload) => {
    try {
        const updated = await prisma.job.update({
            where: { id: jobId },
            data: {
                jobName: payload.jobName,
                jobType: payload.jobType,
                jobDescription: payload.jobDescription,
                numberOfCandidateNeeded: payload.numberOfCandidateNeeded,
                minimumSalary: payload.minimumSalary,
                maximumSalary: payload.maximumSalary,
                minimumProfileInformationRequired:
                    payload.minimumProfileInformationRequired as unknown as object,
            },
        });
        return updated;
    } catch (error) {
        console.error("Error updating job:", error);
        appAssert(false, INTERNAL_SERVER_ERROR, "Failed to update job");
    }
};

export const getAllJobsService = async () => {
    try {
        return await prisma.job.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        appAssert(false, INTERNAL_SERVER_ERROR, "Failed to fetch jobs");
    }
};

export const getJobByIdService = async (id: string) => {
    try {
        return await prisma.job.findUnique({ where: { id } });
    } catch (error) {
        console.error("Error fetching job by id:", error);
        appAssert(false, INTERNAL_SERVER_ERROR, "Failed to fetch job");
    }
};

export const deleteJobService = async (id: string) => {
    try {
        return await prisma.job.delete({ where: { id } });
    } catch (error) {
        console.error("Error deleting job:", error);
        appAssert(false, INTERNAL_SERVER_ERROR, "Failed to delete job");
    }
};