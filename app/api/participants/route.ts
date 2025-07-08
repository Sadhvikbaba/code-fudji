import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient, ParticipantInfo } from 'livekit-server-sdk';

// Set LiveKit RoomService
const livekitHost = process.env.LIVEKIT_URL || 'https://livekit.example.com';
const roomService = new RoomServiceClient(
  livekitHost,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

// Response types
type SuccessResponse = {
  participants: ParticipantInfo[];
};

type ErrorResponse = {
  error: string;
};

// GET method handler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomName = searchParams.get('roomName');

  console.log('Received GET /api/participants for room:', roomName);

  if (!roomName) {
    const error: ErrorResponse = { error: 'roomName is required' };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    const participants = await roomService.listParticipants(roomName);
    const response: SuccessResponse = { participants };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('LiveKit error:', error);
    const errResp: ErrorResponse = { error: 'Failed to fetch participants' };
    return NextResponse.json(errResp, { status: 500 });
  }
}
