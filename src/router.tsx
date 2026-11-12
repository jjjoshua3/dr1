import { createRouter } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import { AppError } from "@/components/app-error";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppError,
    defaultNotFoundComponent: NotFound,
  });
}
