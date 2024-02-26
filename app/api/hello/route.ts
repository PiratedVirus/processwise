export async function GET(request: Request) {
    return new Response(("Hello from the other side!"), {
      status: 200
    });
  }
  