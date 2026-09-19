import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'ds_playground_user_progress_v1';

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedChallenges: [],
  passedQuizzes: [],
  xp: 0,
  streakDays: 1,
  unlockedBadges: ['New Explorer']
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const addXP = (amount: number, reason?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const badges = [...prev.unlockedBadges];

      if (newXP >= 100 && !badges.includes('Stack Explorer')) badges.push('Stack Explorer');
      if (newXP >= 200 && !badges.includes('Queue Master')) badges.push('Queue Master');
      if (newXP >= 300 && !badges.includes('Pointer Pioneer')) badges.push('Pointer Pioneer');
      if (newXP >= 450 && !badges.includes('Tree Explorer')) badges.push('Tree Explorer');
      if (newXP >= 600 && !badges.includes('Graph Navigator')) badges.push('Graph Navigator');
      if (newXP >= 750 && !badges.includes('Sorting Wizard')) badges.push('Sorting Wizard');
      if (newXP >= 900 && !badges.includes('DSA Detective')) badges.push('DSA Detective');

      return {
        ...prev,
        xp: newXP,
        unlockedBadges: badges
      };
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // fallback
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      }));
      addXP(40, "Lesson Completed");
    }
  };

  const markChallengeComplete = (challengeId: string, xpReward: number = 50) => {
    if (!progress.completedChallenges.includes(challengeId)) {
      setProgress(prev => ({
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId]
      }));
      addXP(xpReward, "Challenge Solved");
    }
  };

  const markQuizPassed = (quizId: string) => {
    if (!progress.passedQuizzes.includes(quizId)) {
      setProgress(prev => ({
        ...prev,
        passedQuizzes: [...prev.passedQuizzes, quizId]
      }));
      addXP(30, "Quiz Question Mastered");
    }
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    progress,
    addXP,
    markLessonComplete,
    markChallengeComplete,
    markQuizPassed,
    resetProgress
  };
}
