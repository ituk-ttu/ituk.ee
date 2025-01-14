import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "../i18nConfig"
import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
    return i18nRouter(request, i18nConfig);
};

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};