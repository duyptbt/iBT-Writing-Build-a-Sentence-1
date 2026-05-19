
import React from 'react';
import { Feedback } from '../types';

interface FeedbackDisplayProps {
  feedback: Feedback;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  return (
    <div className="mt-8 bg-white border border-indigo-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-white font-bold text-lg">Detailed Feedback / Nhận xét chi tiết</h3>
          <p className="text-indigo-100 text-sm font-medium">{feedback.levelDescription}</p>
        </div>
        <div className="bg-white text-indigo-700 px-6 py-2 rounded-full font-bold text-2xl shadow-inner">
          {feedback.score.toFixed(1)} <span className="text-sm text-indigo-400">/ 5.0</span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
            <span className="bg-green-100 text-green-600 p-1.5 rounded mr-2 leading-none">✓</span>
            Rubric Strengths / Điểm mạnh
          </h4>
          <ul className="list-disc list-inside text-slate-600 ml-4 space-y-1">
            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
            <span className="bg-amber-100 text-amber-600 p-1.5 rounded mr-2 leading-none">!</span>
            Areas for Improvement / Điểm cần cải thiện
          </h4>
          <ul className="list-disc list-inside text-slate-600 ml-4 space-y-1">
            {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        {feedback.corrections.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded mr-2 leading-none">✎</span>
              Language Facility Corrections / Sửa lỗi ngôn ngữ
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2 italic text-slate-700 border-l-4 border-indigo-400 shadow-sm">
              {feedback.corrections.map((c, i) => <p key={i}>"{c}"</p>)}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
            <span className="bg-slate-100 text-slate-600 p-1.5 rounded mr-2 leading-none">💬</span>
            Examiner's Comments / Nhận xét của giám khảo
          </h4>
          <p className="text-slate-600 bg-slate-50 p-4 rounded-lg leading-relaxed border border-slate-100">
            {feedback.overallComments}
          </p>
        </div>
      </div>
    </div>
  );
};
