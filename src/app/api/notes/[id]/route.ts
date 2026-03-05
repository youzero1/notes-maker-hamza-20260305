import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';
import { UpdateNoteDto } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOneBy({ id: params.id });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { ...note, isCompleted: Boolean(note.isCompleted) } });
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOneBy({ id: params.id });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body: UpdateNoteDto = await request.json();

    if (body.title !== undefined && body.title.trim() === '') {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 });
    }

    if (body.title !== undefined) note.title = body.title.trim();
    if (body.description !== undefined) note.description = body.description?.trim();
    if (body.priority !== undefined) note.priority = body.priority;
    if (body.category !== undefined) note.category = body.category?.trim();
    if (body.isCompleted !== undefined) note.isCompleted = body.isCompleted;

    const updated = await repo.save(note);
    return NextResponse.json({
      data: { ...updated, isCompleted: Boolean(updated.isCompleted) },
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOneBy({ id: params.id });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await repo.remove(note);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
