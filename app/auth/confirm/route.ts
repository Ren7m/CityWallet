import type {
  EmailOtpType,
} from "@supabase/supabase-js";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  createClient,
} from "../../../lib/supabase/server";

export async function GET(
  request: NextRequest
) {
  const { searchParams } =
    new URL(request.url);

  const tokenHash =
    searchParams.get(
      "token_hash"
    );

  const type =
    searchParams.get(
      "type"
    ) as EmailOtpType | null;

  const verifiedUrl =
    request.nextUrl.clone();

  verifiedUrl.pathname =
    "/auth/verified";

  verifiedUrl.search = "";

  if (
    !tokenHash ||
    !type
  ) {
    verifiedUrl.searchParams.set(
      "status",
      "error"
    );

    return NextResponse.redirect(
      verifiedUrl
    );
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase.auth.verifyOtp({
        token_hash:
          tokenHash,

        type,
      });

    if (error) {
      console.error(
        "Email confirmation error:",
        error.message
      );

      verifiedUrl.searchParams.set(
        "status",
        "error"
      );

      return NextResponse.redirect(
        verifiedUrl
      );
    }

    verifiedUrl.searchParams.set(
      "status",
      "success"
    );

    return NextResponse.redirect(
      verifiedUrl
    );
  } catch (error) {
    console.error(
      "Unexpected email confirmation error:",
      error
    );

    verifiedUrl.searchParams.set(
      "status",
      "error"
    );

    return NextResponse.redirect(
      verifiedUrl
    );
  }
}