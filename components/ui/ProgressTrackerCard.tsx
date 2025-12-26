import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';

export function ProgressTrackerCard() {
  const data = [
    {
      day: 'Monday',
      workout: 'Cardio & Upper Body',
      meal: 'Banana with Peanut Butter',
      water: '8 glasses',
      sleep: '7 hours',
    },
    {
      day: 'Tuesday',
      workout: 'Lower Body',
      meal: 'Oatmeal',
      water: '8 glasses',
      sleep: '7 hours',
    },
    {
      day: 'Wednesday',
      workout: 'Rest Day',
      meal: '-',
      water: '8 glasses',
      sleep: '7 hours',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.title}>
          Weekly Progress 📊
        </ThemedText>

        {data.map((item, index) => (
          <View key={index} style={styles.dayBlock}>
            <ThemedText style={styles.dayTitle}>
              {item.day}
            </ThemedText>

            <ThemedText style={styles.row}>
              Workout: {item.workout} 🏋️
            </ThemedText>

            <ThemedText style={styles.row}>
              Pre-Workout Meal: {item.meal} 🍽️
            </ThemedText>

            <ThemedText style={styles.row}>
              Water Intake: {item.water} 💧
            </ThemedText>

            <ThemedText style={styles.row}>
              Sleep: {item.sleep} 😴
            </ThemedText>
          </View>
        ))}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'flex-start', // 👈 left aligned
    paddingLeft: 12,
    marginVertical: 8,
  },
  card: {
    width: '92%', // ✅ increased width
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  dayBlock: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  row: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});
