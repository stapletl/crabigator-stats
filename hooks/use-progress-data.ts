"use client";

import { useEffect, useCallback } from "react";
import { useAppStore } from "@/stores";
import { WaniKaniAPI } from "@/lib/wanikani/api";
import type { LevelProgression, Assignment, ReviewStatistic } from "@/lib/wanikani/types";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProgressData() {
  const {
    apiKey,
    levelProgressions,
    assignments,
    reviewStatistics,
    summary,
    lastProgressionsSync,
    lastAssignmentsSync,
    lastStatisticsSync,
    lastSummarySync,
    setLevelProgressions,
    setAssignments,
    setReviewStatistics,
    setSummary,
    setIsLoadingProgressions,
    setIsLoadingAssignments,
    setIsLoadingStatistics,
    setIsLoadingSummary,
    isLoadingProgressions,
    isLoadingAssignments,
    isLoadingStatistics,
    isLoadingSummary,
  } = useAppStore();

  const isCacheValid = useCallback((lastSync: number | null) => {
    if (!lastSync) return false;
    return Date.now() - lastSync < CACHE_DURATION;
  }, []);

  const fetchLevelProgressions = useCallback(async () => {
    if (!apiKey) return;
    if (isCacheValid(lastProgressionsSync) && levelProgressions) return;

    try {
      setIsLoadingProgressions(true);
      const api = new WaniKaniAPI(apiKey);
      const response = await api.getLevelProgressions();
      const allProgressions = await api.getAllPages<LevelProgression>(response.url);
      setLevelProgressions(allProgressions);
    } catch (error) {
      console.error("Failed to fetch level progressions:", error);
    } finally {
      setIsLoadingProgressions(false);
    }
  }, [
    apiKey,
    isCacheValid,
    lastProgressionsSync,
    levelProgressions,
    setLevelProgressions,
    setIsLoadingProgressions,
  ]);

  const fetchAssignments = useCallback(async () => {
    if (!apiKey) return;
    if (isCacheValid(lastAssignmentsSync) && assignments) return;

    try {
      setIsLoadingAssignments(true);
      const api = new WaniKaniAPI(apiKey);
      const response = await api.getAssignments();
      const allAssignments = await api.getAllPages<Assignment>(response.url);
      setAssignments(allAssignments);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setIsLoadingAssignments(false);
    }
  }, [
    apiKey,
    isCacheValid,
    lastAssignmentsSync,
    assignments,
    setAssignments,
    setIsLoadingAssignments,
  ]);

  const fetchReviewStatistics = useCallback(async () => {
    if (!apiKey) return;
    if (isCacheValid(lastStatisticsSync) && reviewStatistics) return;

    try {
      setIsLoadingStatistics(true);
      const api = new WaniKaniAPI(apiKey);
      const response = await api.getReviewStatistics();
      const allStatistics = await api.getAllPages<ReviewStatistic>(response.url);
      setReviewStatistics(allStatistics);
    } catch (error) {
      console.error("Failed to fetch review statistics:", error);
    } finally {
      setIsLoadingStatistics(false);
    }
  }, [
    apiKey,
    isCacheValid,
    lastStatisticsSync,
    reviewStatistics,
    setReviewStatistics,
    setIsLoadingStatistics,
  ]);

  const fetchSummary = useCallback(async () => {
    if (!apiKey) return;
    if (isCacheValid(lastSummarySync) && summary) return;

    try {
      setIsLoadingSummary(true);
      const api = new WaniKaniAPI(apiKey);
      const summaryData = await api.getSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [
    apiKey,
    isCacheValid,
    lastSummarySync,
    summary,
    setSummary,
    setIsLoadingSummary,
  ]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchLevelProgressions(),
      fetchAssignments(),
      fetchReviewStatistics(),
      fetchSummary(),
    ]);
  }, [
    fetchLevelProgressions,
    fetchAssignments,
    fetchReviewStatistics,
    fetchSummary,
  ]);

  useEffect(() => {
    if (apiKey) {
      refreshAll();
    }
  }, [apiKey]); // Only run on mount or when apiKey changes

  return {
    // Data
    levelProgressions,
    assignments,
    reviewStatistics,
    summary,

    // Loading states
    isLoadingProgressions,
    isLoadingAssignments,
    isLoadingStatistics,
    isLoadingSummary,
    isLoading:
      isLoadingProgressions ||
      isLoadingAssignments ||
      isLoadingStatistics ||
      isLoadingSummary,

    // Refresh functions
    refreshAll,
    fetchLevelProgressions,
    fetchAssignments,
    fetchReviewStatistics,
    fetchSummary,
  };
}
