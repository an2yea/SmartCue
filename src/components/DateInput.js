import { useState } from 'react';
import styles from './DateInput.module.css';

export default function DateInput({ value, onChange, required }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={styles.dateInputWrapper}>
      <input
        type="date"
        value={value || ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`${styles.dateInput} ${value ? styles.hasValue : ''} ${focused ? styles.focused : ''}`}
        min={new Date().toISOString().split('T')[0]}
      />
      {!value && !focused && (
        <span className={styles.placeholder}>Set Deadline</span>
      )}
    </div>
  );
} 