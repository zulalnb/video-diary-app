import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

import { DATABASE_NAME, db } from '@/db/client';
import migrations from '@/drizzle/migrations';

function DrizzleStudio() {
  const db = useSQLiteContext();

  if (__DEV__) {
    useDrizzleStudio(db);
  }

  return null;
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export default function DatabaseProvider(props: DatabaseProviderProps) {
  const { success, error } = useMigrations(db, migrations);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense>
        <DrizzleStudio />
        {props.children}
      </SQLiteProvider>
    </Suspense>
  );
}
