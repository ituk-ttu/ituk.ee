import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "../i18nConfig"
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const supplied_token = request.nextUrl.searchParams.get('token');
        const valid_token = process.env.ADMIN_TOKEN
    
        if (supplied_token !== valid_token) {
            console.log(new URL('/proxy', request.url))
            return NextResponse.rewrite(request.url + '/not-found');
        } else {
            return i18nRouter(request, i18nConfig);
        }
    }

    return i18nRouter(request, i18nConfig);
};

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};