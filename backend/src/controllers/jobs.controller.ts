import { OK, CREATED, NOT_FOUND } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErros";
import {
    createJobService,
    updateJobService,
    getAllJobsService,
    getJobByIdService,
    deleteJobService,
} from "../services/jobs.service";

// CREATE JOB
export const createJobController = catchErrors(async (req, res) => {
    const { userId } = req;
    const data = req.body;

    const newJob = await createJobService(userId.toString(), data);
    return res.status(CREATED).json({ job: newJob });
});

// UPDATE JOB
export const updateJobController = catchErrors(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const updated = await updateJobService(id, data);
    appAssert(updated, NOT_FOUND, "Job not found");

    return res.status(OK).json({ job: updated });
});

// GET ALL JOBS
export const getAllJobsController = catchErrors(async (req, res) => {
    const jobs = await getAllJobsService();
    return res.status(OK).json({ jobs });
});

// GET JOB BY ID
export const getJobByIdController = catchErrors(async (req, res) => {
    const { id } = req.params;
    const job = await getJobByIdService(id);
    appAssert(job, NOT_FOUND, "Job not found");
    return res.status(OK).json({ job });
});

// DELETE JOB
export const deleteJobController = catchErrors(async (req, res) => {
    const { id } = req.params;
    const deletedJob = await deleteJobService(id);
    appAssert(deletedJob, NOT_FOUND, "Job not found");
    return res.status(OK).json({ message: "Job deleted successfully" });
});