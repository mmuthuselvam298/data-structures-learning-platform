import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

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
  const {
    user,
    isAuthenticated,
    completeLesson: authCompleteLesson,
    submitChallenge: authSubmitChallenge,
    submitQuiz: authSubmitQuiz,
    progressData
  } = useAuth();

  const [localProgress, setLocalProgress] = useState<UserProgress>(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localProgress));
    } catch {
      // ignore
    }
  }, [localProgress]);

  // Aggregate current progress whether authenticated or guest
  const progress: UserProgress = {
    completedLessons: isAuthenticated ? progressData.completedLessons : localProgress.completedLessons,
    completedChallenges: isAuthenticated
      ? progressData.challengeAttempts.map(a => a.challenge_id)
      : localProgress.completedChallenges,
    passedQuizzes: isAuthenticated
      ? progressData.quizAttempts.map(q => q.quiz_id)
      : localProgress.passedQuizzes,
    xp: isAuthenticated && user ? user.xp : localProgress.xp,
    streakDays: isAuthenticated && user ? user.streak : localProgress.streakDays,
    unlockedBadges: isAuthenticated ? progressData.achievements : localProgress.unlockedBadges
  };

  const addXP = (amount: number, reason?: string) => {
    setLocalProgress(prev => {
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

  const markLessonComplete = async (lessonId: string, unitId: string = 'unit1') => {
    if (isAuthenticated) {
      await authCompleteLesson(lessonId, unitId);
    } else {
      if (!localProgress.completedLessons.includes(lessonId)) {
        setLocalProgress(prev => ({
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId]
        }));
        addXP(40, "Lesson Completed");
      }
    }
  };

  const markChallengeComplete = async (challengeId: string, xpReward: number = 50) => {
    if (isAuthenticated) {
      await authSubmitChallenge(challengeId, 'medium', 1, 1, 60, []);
    } else {
      if (!localProgress.completedChallenges.includes(challengeId)) {
        setLocalProgress(prev => ({
          ...prev,
          completedChallenges: [...prev.completedChallenges, challengeId]
        }));
        addXP(xpReward, "Challenge Solved");
      }
    }
  };

  const markQuizPassed = async (quizId: string) => {
    if (isAuthenticated) {
      await authSubmitQuiz(quizId, 1, 1);
    } else {
      if (!localProgress.passedQuizzes.includes(quizId)) {
        setLocalProgress(prev => ({
          ...prev,
          passedQuizzes: [...prev.passedQuizzes, quizId]
        }));
        addXP(30, "Quiz Question Mastered");
      }
    }
  };

  const resetProgress = () => {
    setLocalProgress(defaultProgress);
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
