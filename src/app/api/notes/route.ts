import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';
import { CreateNoteDto, NotesFilter } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Like, FindOptionsOrder } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const repo = await getNoteRepository();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc').toUpperCase() as 'ASC' | 'DESC';

    const where: Record<string, unknown>[] = [];
    const baseWhere: Record<string, unknown> = {};

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      baseWhere.priority = priority;
    }

    if (status === 'completed') {
      baseWhere.isCompleted = 1;
    } else if (status === 'pending') {
      baseWhere.isCompleted = 0;
    }

    if (search) {
      where.push({ ...baseWhere, title: Like(`%${search}%`) });
      where.push({ ...baseWhere, description: Like(`%${search}%`) });
    } else {
      where.push(baseWhere);
    }

    const orderMap: Record<string, FindOptionsOrder<import('@/entities/Note').NoteEntity>> = {
      createdAt: { createdAt: sortOrder },
      title: { title: sortOrder },
      priority: { priority: sortOrder },
    };

    const order = orderMap[sortBy] || { createdAt: 'DESC' };

    const notes = await repo.find({ where, order });

    const formattedNotes = notes.map((note) => ({
      ...note,
      isCompleted: Boolean(note.isCompleted),
    }));

    return NextResponse.json({ data: formattedNotes });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const repo = await getNoteRepository();
    const body: CreateNoteDto = await request.json();

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }

    const note = repo.create({
      id: uuidv4(),
      title: body.title.trim(),
      description: body.description?.trim(),
      priority: body.priority || 'medium',
      category: body.category?.trim(),
      isCompleted: false,
    });

    const saved = await repo.save(note);
    return NextResponse.json(
      { data: { ...saved, isCompleted: Boolean(saved.isCompleted) }, message: 'Note created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
