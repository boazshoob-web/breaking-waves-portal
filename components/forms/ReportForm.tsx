'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, AlertCircle } from 'lucide-react';
import { createReportSchema, type CreateReportInput } from '@/lib/validations/reports';

interface Team {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  name: string;
  teamId: string | null;
}

interface Skipper {
  id: string;
  fullName: string;
}

interface ReportFormProps {
  defaultValues?: Partial<CreateReportInput>;
  defaultParticipantIds?: string[];
  onSubmit: (data: CreateReportInput) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
}

export default function ReportForm({
  defaultValues,
  defaultParticipantIds,
  onSubmit,
  submitLabel,
  isLoading,
}: ReportFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [skippers, setSkippers] = useState<Skipper[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    defaultParticipantIds || []
  );
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateReportInput>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      date: defaultValues?.date || new Date().toISOString().split('T')[0],
      ...defaultValues,
      participantIds: defaultParticipantIds || [],
    },
  });

  const selectedTeamId = watch('teamId');

  useEffect(() => {
    Promise.all([
      fetch('/api/reports/teams').then((r) => r.json()),
      fetch('/api/reports/participants').then((r) => r.json()),
      fetch('/api/reports/skippers').then((r) => r.json()),
    ]).then(([t, p, s]) => {
      setTeams(t);
      setAllParticipants(p);
      setSkippers(s);
    });
  }, []);

  // Filter participants by selected team
  const filteredParticipants = selectedTeamId
    ? allParticipants.filter((p) => p.teamId === selectedTeamId || !p.teamId)
    : allParticipants;

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = async (data: CreateReportInput) => {
    if (selectedParticipants.length === 0) {
      setError('יש לסמן לפחות משתתף אחד');
      return;
    }
    setError('');
    await onSubmit({ ...data, participantIds: selectedParticipants });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-error-red/10 text-error-red rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Row 1: Team + Date */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teamId" className="input-label">שם הצוות *</label>
          <select
            id="teamId"
            className={`select-field ${errors.teamId ? 'border-error-red' : ''}`}
            {...register('teamId')}
          >
            <option value="">בחר צוות...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          {errors.teamId && <p className="input-error">{errors.teamId.message}</p>}
        </div>

        <div>
          <label htmlFor="date" className="input-label">תאריך *</label>
          <input
            id="date"
            type="date"
            className={`input-field ${errors.date ? 'border-error-red' : ''}`}
            dir="ltr"
            {...register('date')}
          />
          {errors.date && <p className="input-error">{errors.date.message}</p>}
        </div>
      </div>

      {/* Secondary Skipper */}
      <div>
        <label htmlFor="secondarySkipperId" className="input-label">סקיפר שני (אופציונלי)</label>
        <select
          id="secondarySkipperId"
          className="select-field"
          {...register('secondarySkipperId')}
        >
          <option value="">ללא סקיפר שני</option>
          {skippers.map((s) => (
            <option key={s.id} value={s.id}>{s.fullName}</option>
          ))}
        </select>
      </div>

      {/* Participants Checklist */}
      <div>
        <label className="input-label">
          משתתפים נוכחים * ({selectedParticipants.length} נבחרו)
        </label>
        {filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
            {filteredParticipants.map((p) => (
              <label
                key={p.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedParticipants.includes(p.id)
                    ? 'bg-ocean-blue/10 border border-ocean-blue/30'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(p.id)}
                  onChange={() => toggleParticipant(p.id)}
                  className="w-4 h-4 text-ocean-blue rounded"
                />
                <span className="text-sm font-medium">{p.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            {selectedTeamId ? 'אין משתתפים בצוות זה' : 'בחרו צוות כדי לראות משתתפים'}
          </p>
        )}
      </div>

      {/* Activity Description */}
      <div>
        <label htmlFor="activityDescription" className="input-label">תיאור הפעילות *</label>
        <textarea
          id="activityDescription"
          rows={3}
          className={`textarea-field ${errors.activityDescription ? 'border-error-red' : ''}`}
          placeholder="תארו את הפעילות שבוצעה..."
          {...register('activityDescription')}
        />
        {errors.activityDescription && (
          <p className="input-error">{errors.activityDescription.message}</p>
        )}
      </div>

      {/* Weather */}
      <div>
        <label htmlFor="weatherConditions" className="input-label">תנאי מזג אוויר *</label>
        <textarea
          id="weatherConditions"
          rows={2}
          className={`textarea-field ${errors.weatherConditions ? 'border-error-red' : ''}`}
          placeholder="תנאי רוח, ים, טמפרטורה..."
          {...register('weatherConditions')}
        />
        {errors.weatherConditions && (
          <p className="input-error">{errors.weatherConditions.message}</p>
        )}
      </div>

      {/* Emotional Handling */}
      <div>
        <label htmlFor="emotionalHandling" className="input-label">התמודדות רגשית *</label>
        <textarea
          id="emotionalHandling"
          rows={3}
          className={`textarea-field ${errors.emotionalHandling ? 'border-error-red' : ''}`}
          placeholder="תארו את המצב הרגשי של המשתתפים..."
          {...register('emotionalHandling')}
        />
        {errors.emotionalHandling && (
          <p className="input-error">{errors.emotionalHandling.message}</p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summaryNextSteps" className="input-label">סיכום ונקודות להמשך *</label>
        <textarea
          id="summaryNextSteps"
          rows={3}
          className={`textarea-field ${errors.summaryNextSteps ? 'border-error-red' : ''}`}
          placeholder="מסקנות והמלצות..."
          {...register('summaryNextSteps')}
        />
        {errors.summaryNextSteps && (
          <p className="input-error">{errors.summaryNextSteps.message}</p>
        )}
      </div>

      {/* General Notes */}
      <div>
        <label htmlFor="generalNotes" className="input-label">הערות כלליות ולסירה (אופציונלי)</label>
        <textarea
          id="generalNotes"
          rows={2}
          className="textarea-field"
          placeholder="הערות נוספות, בעיות טכניות..."
          {...register('generalNotes')}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <span className="spinner" /> : <Save className="w-5 h-5" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
