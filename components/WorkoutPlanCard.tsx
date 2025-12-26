import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Exercise { name: string; sets?: string; reps?: string; duration?: string; notes?: string }
interface DayPlan { day: string; focus?: string; exercises: Exercise[]; notes?: string }
interface WorkoutPlanCardProps { dayPlan: DayPlan }

export function WorkoutPlanCard({ dayPlan }: WorkoutPlanCardProps) {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.dayTitle}>{dayPlan.day}</ThemedText>
        {dayPlan.focus ? <ThemedText style={styles.focus}>{dayPlan.focus}</ThemedText> : null}
      </View>

      <View style={styles.exercisesContainer}>
        {dayPlan.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseRow}>
            <View style={styles.exerciseNumber}><ThemedText style={styles.exerciseNumberText}>{index + 1}</ThemedText></View>
            <View style={styles.exerciseDetails}>
              <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
              {(exercise.sets || exercise.reps || exercise.duration) && (
                <View style={styles.exerciseStats}>
                  {exercise.sets ? <View style={styles.statBadge}><ThemedText style={styles.statText}>{exercise.sets} sets</ThemedText></View> : null}
                  {exercise.reps ? <View style={styles.statBadge}><ThemedText style={styles.statText}>{exercise.reps} reps</ThemedText></View> : null}
                  {exercise.duration ? <View style={styles.statBadge}><ThemedText style={styles.statText}>{exercise.duration}</ThemedText></View> : null}
                </View>
              )}
              {exercise.notes ? <ThemedText style={styles.exerciseNotes}>{exercise.notes}</ThemedText> : null}
            </View>
          </View>
        ))}
      </View>

      {dayPlan.notes ? (
        <View style={styles.dayNotesContainer}><ThemedText style={styles.dayNotes}>💡 {dayPlan.notes}</ThemedText></View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(78,205,196,0.04)', borderRadius: 14, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: 'rgba(78,205,196,0.2)' },
  header: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(78,205,196,0.12)' },
  dayTitle: { fontSize: 18, fontWeight: '800', color: '#4ECDC4', marginBottom: 4 },
  focus: { fontSize: 13, opacity: 0.85, fontStyle: 'italic' },
  exercisesContainer: { gap: 10 },
  exerciseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  exerciseNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center' },
  exerciseNumberText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  exerciseDetails: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  exerciseStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  statBadge: { backgroundColor: 'rgba(78,205,196,0.18)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statText: { fontSize: 12, color: '#118C7D', fontWeight: '700' },
  exerciseNotes: { fontSize: 12, opacity: 0.7, fontStyle: 'italic', marginTop: 2 },
  dayNotesContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(78,205,196,0.06)' },
  dayNotes: { fontSize: 13, opacity: 0.85, lineHeight: 18 },
});

