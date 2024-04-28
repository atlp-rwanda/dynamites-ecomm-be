import request from "supertest";
import app from "../index";

export async function beforeAllHook() {
  jest.setTimeout(50000);
}

// new code .. here