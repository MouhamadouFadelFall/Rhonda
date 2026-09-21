/**
 * RHONDA — Types & Interfaces
 * Phase 1 to Phase 10 Specifications
 */

export type RhondaState =
  | 'READY'
  | 'LISTENING'
  | 'RECEIVING'
  | 'THINKING'
  | 'UNDERSTANDING'
  | 'PLANNING'
  | 'WORKING'
  | 'WAITING_AUTHORIZATION'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'ERROR'
  | 'DEGRADED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus =
  | 'PENDING'
  | 'ANALYZING'
  | 'PLANNING'
  | 'WAITING_AUTHORIZATION'
  | 'READY'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type StepStatus = 'PENDING' | 'READY' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface UserRequest {
  id: string;
  user_id: string;
  conversation_id: string;
  project_id?: string;
  content: string;
  input_type: 'TEXT' | 'VOICE' | 'IMAGE' | 'SCREEN' | 'FILE' | 'TELEGRAM';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Intent {
  name: string;
  description: string;
  goal: string;
  target?: string;
  parameters: Record<string, unknown>;
  risk_level: RiskLevel;
  confidence: number;
  requires_authorization: boolean;
  needs_clarification?: boolean;
  clarification_question?: string;
  secondary_intent?: string;
}

export interface PlanStep {
  index: number;
  action: string;
  description: string;
  tool: string;
  parameters: Record<string, unknown>;
  risk_level: RiskLevel;
  status: StepStatus;
  output?: string;
}

export interface ExecutionPlan {
  id: string;
  intent_id: string;
  objective: string;
  steps: PlanStep[];
  risk_level: RiskLevel;
  required_tools: string[];
  requires_authorization: boolean;
  expected_result: string;
  status: 'PENDING' | 'VALIDATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'NEEDS_CLARIFICATION';
}

export interface RhondaTask {
  id: string;
  user_id: string;
  conversation_id: string;
  project_id?: string;
  request_content: string;
  intent: Intent;
  plan: ExecutionPlan;
  status: TaskStatus;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  current_step_index: number;
  progress: number;
  result?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
  execution_logs: string[];
}

export interface RegisteredTool {
  id: string;
  name: string;
  category: 'filesystem' | 'terminal' | 'python' | 'r' | 'system' | 'multimodal';
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  default_risk: RiskLevel;
  requires_authorization: boolean;
  is_installed: boolean;
  sample_call?: string;
}

export interface SystemEvent {
  id: string;
  event_type: string;
  timestamp: string;
  task_id?: string;
  source: 'CORE' | 'AGENT' | 'SECURITY' | 'TELEGRAM' | 'VOICE' | 'SYSTEM';
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  details: string;
}

export interface MemoryItem {
  id: string;
  category: 'FACT' | 'PREFERENCE' | 'DECISION' | 'ENVIRONMENT';
  key: string;
  content: string;
  confidence: number;
  project_id?: string;
  created_at: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  directory_path: string;
  active: boolean;
  files_count: number;
  last_activity: string;
}

export interface DiagnosticService {
  id: string;
  name: string;
  category: 'CORE' | 'SYSTEM' | 'AI' | 'INTERFACES';
  version?: string;
  status: 'OK' | 'WARNING' | 'ERROR' | 'UNAVAILABLE';
  latency_ms: number;
  details: string;
  cpu_impact: 'MINIMAL' | 'LOW' | 'MEDIUM';
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'rhonda';
  text: string;
  timestamp: string;
  authorization_request?: {
    action_id: string;
    action_name: string;
    risk_level: RiskLevel;
    confirmed?: boolean;
  };
}

export interface PhaseInfo {
  number: number;
  title: string;
  subtitle: string;
  status: 'VALIDATED' | 'READY' | 'ACTIVE' | 'TARGET';
  objective: string;
  coreConcepts: string[];
  architectureDiagram: string;
  codeFiles: { filename: string; path: string; language: string; content: string; description: string }[];
  validationChecklist: { item: string; checked: boolean }[];
}
