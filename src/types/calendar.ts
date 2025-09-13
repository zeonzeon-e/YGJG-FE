// src/types/calendar.ts (새로운 타입 정의 파일 예시)

export interface CalendarEvent {
  id: number; // 이벤트 고유 ID
  date: string; // 날짜 (예: "2025-09-10")
  title: string; // 이벤트 제목 (예: "정기 훈련")
  description?: string; // 상세 내용
  startTime: string; // 시작 시간 (예: "19:00")
  endTime: string; // 종료 시간 (예: "21:00")

  // 개인 캘린더에서 여러 팀을 구분하기 위한 속성
  teamId: number;
  teamName?: string;
  teamColor?: string;
}
