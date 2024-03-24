import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const assetManifest = JSON.parse(manifestJSON);

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      // Add logic to decide whether to serve an asset or run your original Worker code
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      let pathname = new URL(request.url).pathname;
      switch (pathname) {
        case "/api/register":
          return await register(request, env);
        case "/api/login":
          return await login(request, env);
        case "/api/accounts":
          return await accounts(request, env);
        case "/api/addAccount":
          return await addAccount(request, env);
        case "/api/records":
          return await records(request, env);
        case "/api/addRecord":
          return await addRecord(request, env);
        default:
          return new Response("Not Found", { status: 404 });
      }
    }
  },
};

function errorSQLResponse(e: unknown): Response {
  if (e instanceof Error) {
    return new Response(
      JSON.stringify({ success: false, error: e.message, results: [] }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unknown error occurred",
        results: [],
      }),
      { status: 200 }
    );
  }
}

async function register(request: Request, env: Env): Promise<Response> {
  const { name, username, password } = await request.json<{
    name: string;
    username: string;
    password: string;
  }>();

  try {
    const { success, results } = await env.DB.prepare(
      `insert into users(name, username, password) values (?, ?, ?)`
    )
      .bind(name, username, password)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}

async function login(request: Request, env: Env): Promise<Response> {
  const { username, password } = await request.json<{
    username: string;
    password: string;
  }>();

  try {
    const { success, results } = await env.DB.prepare(
      `select name from users where username = ? and password = ?`
    )
      .bind(username, password)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}

async function accounts(request: Request, env: Env): Promise<Response> {
  const { username, password } = await request.json<{
    username: string;
    password: string;
  }>();

  try {
    const { success, results } = await env.DB.prepare(
      `select * from accounts where userId = (select id from users where username = ? and password = ?)`
    )
      .bind(username, password)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}

async function addAccount(request: Request, env: Env): Promise<Response> {
  const { username, password, accountName, accountBalance } =
    await request.json<{
      username: string;
      password: string;
      accountName: string;
      accountBalance: number;
    }>();

  try {
    const { success, results } = await env.DB.prepare(
      `insert into accounts (name, balance, userId) values (?, ?, (
        select id from users where username = ? and password = ?
      ))`
    )
      .bind(accountName, accountBalance, username, password)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}

async function records(request: Request, env: Env): Promise<Response> {
  const { username, password } = await request.json<{
    username: string;
    password: string;
  }>();

  try {
    const { success, results } = await env.DB.prepare(
      `select * from records
        where id in (
          select recordId from recordusers
          where userId = (
            select id from users where username = ? and password = ?
          )
        )`
    )
      .bind(username, password)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}

async function addRecord(request: Request, env: Env): Promise<Response> {
  const { username, password, recordName, recordDescription } =
    await request.json<{
      username: string;
      password: string;
      recordName: string;
      recordDescription: number;
    }>();

  try {
    const { success, results } = await env.DB.prepare(
      `insert into records (name, description, createdBy) values (?, ?, (
        select id from users where username = ? and password = ?
      )) returning id, createdBy`
    )
      .bind(recordName, recordDescription, username, password)
      .all();

    if (!success) {
      return new Response(JSON.stringify({ success: false, results }), {
        headers: { "content-type": "text/plain" },
      });
    }

    const recordId = results[0].id;
    const createdBy = results[0].createdBy;

    await env.DB.prepare(
      `insert into recordusers (recordId, userId) values (?, ?)`
    )
      .bind(recordId, createdBy)
      .all();

    return new Response(JSON.stringify({ success, results }), {
      headers: { "content-type": "text/plain" },
    });
  } catch (e: unknown) {
    return errorSQLResponse(e);
  }
}
