import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
};

export type CommentFilter = {
  content?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_neq?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_gt?: InputMaybe<Scalars['Date']['input']>;
  date_gte?: InputMaybe<Scalars['Date']['input']>;
  date_lt?: InputMaybe<Scalars['Date']['input']>;
  date_lte?: InputMaybe<Scalars['Date']['input']>;
  date_neq?: InputMaybe<Scalars['Date']['input']>;
  employee_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id_neq?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  report_id?: InputMaybe<Scalars['ID']['input']>;
  report_id_neq?: InputMaybe<Scalars['ID']['input']>;
};

export type CommentInput = {
  content: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  employee_id: Scalars['ID']['input'];
  report_id: Scalars['ID']['input'];
};

export type ConstellationFilter = {
  description?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_neq?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};

export type ConstellationInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ContactFilter = {
  configuration?: InputMaybe<Scalars['JSON']['input']>;
  configuration_neq?: InputMaybe<Scalars['JSON']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_gt?: InputMaybe<Scalars['Date']['input']>;
  date_gte?: InputMaybe<Scalars['Date']['input']>;
  date_lt?: InputMaybe<Scalars['Date']['input']>;
  date_lte?: InputMaybe<Scalars['Date']['input']>;
  date_neq?: InputMaybe<Scalars['Date']['input']>;
  employee_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id_neq?: InputMaybe<Scalars['ID']['input']>;
  executionScript?: InputMaybe<Scalars['String']['input']>;
  executionScript_gt?: InputMaybe<Scalars['String']['input']>;
  executionScript_gte?: InputMaybe<Scalars['String']['input']>;
  executionScript_lt?: InputMaybe<Scalars['String']['input']>;
  executionScript_lte?: InputMaybe<Scalars['String']['input']>;
  executionScript_neq?: InputMaybe<Scalars['String']['input']>;
  groundStation_id?: InputMaybe<Scalars['ID']['input']>;
  groundStation_id_neq?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  payload_id?: InputMaybe<Scalars['ID']['input']>;
  payload_id_neq?: InputMaybe<Scalars['ID']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id_neq?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_neq?: InputMaybe<Scalars['String']['input']>;
};

export type ContactInput = {
  configuration: Scalars['JSON']['input'];
  date: Scalars['Date']['input'];
  employee_id: Scalars['ID']['input'];
  executionScript: Scalars['String']['input'];
  groundStation_id: Scalars['ID']['input'];
  payload_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type CustomerFilter = {
  email?: InputMaybe<Scalars['String']['input']>;
  email_gt?: InputMaybe<Scalars['String']['input']>;
  email_gte?: InputMaybe<Scalars['String']['input']>;
  email_lt?: InputMaybe<Scalars['String']['input']>;
  email_lte?: InputMaybe<Scalars['String']['input']>;
  email_neq?: InputMaybe<Scalars['String']['input']>;
  employee_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id_neq?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerInput = {
  email: Scalars['String']['input'];
  employee_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type EmployeeFilter = {
  email?: InputMaybe<Scalars['String']['input']>;
  email_gt?: InputMaybe<Scalars['String']['input']>;
  email_gte?: InputMaybe<Scalars['String']['input']>;
  email_lt?: InputMaybe<Scalars['String']['input']>;
  email_lte?: InputMaybe<Scalars['String']['input']>;
  email_neq?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  role_gt?: InputMaybe<Scalars['String']['input']>;
  role_gte?: InputMaybe<Scalars['String']['input']>;
  role_lt?: InputMaybe<Scalars['String']['input']>;
  role_lte?: InputMaybe<Scalars['String']['input']>;
  role_neq?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type GroundStationFilter = {
  coordinates?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  coordinates_neq?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  image?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_neq?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  network_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_neq?: InputMaybe<Scalars['String']['input']>;
};

export type GroundStationInput = {
  coordinates: Array<InputMaybe<Scalars['Float']['input']>>;
  image: Scalars['String']['input'];
  name: Scalars['String']['input'];
  network: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type LaunchFilter = {
  date?: InputMaybe<Scalars['Date']['input']>;
  date_gt?: InputMaybe<Scalars['Date']['input']>;
  date_gte?: InputMaybe<Scalars['Date']['input']>;
  date_lt?: InputMaybe<Scalars['Date']['input']>;
  date_lte?: InputMaybe<Scalars['Date']['input']>;
  date_neq?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  outcome?: InputMaybe<Scalars['String']['input']>;
  outcome_gt?: InputMaybe<Scalars['String']['input']>;
  outcome_gte?: InputMaybe<Scalars['String']['input']>;
  outcome_lt?: InputMaybe<Scalars['String']['input']>;
  outcome_lte?: InputMaybe<Scalars['String']['input']>;
  outcome_neq?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_gt?: InputMaybe<Scalars['String']['input']>;
  provider_gte?: InputMaybe<Scalars['String']['input']>;
  provider_lt?: InputMaybe<Scalars['String']['input']>;
  provider_lte?: InputMaybe<Scalars['String']['input']>;
  provider_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  rocket?: InputMaybe<Scalars['String']['input']>;
  rocket_gt?: InputMaybe<Scalars['String']['input']>;
  rocket_gte?: InputMaybe<Scalars['String']['input']>;
  rocket_lt?: InputMaybe<Scalars['String']['input']>;
  rocket_lte?: InputMaybe<Scalars['String']['input']>;
  rocket_neq?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_neq?: InputMaybe<Scalars['String']['input']>;
};

export type LaunchInput = {
  date: Scalars['Date']['input'];
  outcome?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
  rocket: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type PayloadFilter = {
  category?: InputMaybe<Scalars['String']['input']>;
  category_gt?: InputMaybe<Scalars['String']['input']>;
  category_gte?: InputMaybe<Scalars['String']['input']>;
  category_lt?: InputMaybe<Scalars['String']['input']>;
  category_lte?: InputMaybe<Scalars['String']['input']>;
  category_neq?: InputMaybe<Scalars['String']['input']>;
  configuration?: InputMaybe<Scalars['JSON']['input']>;
  configuration_neq?: InputMaybe<Scalars['JSON']['input']>;
  customer_id?: InputMaybe<Scalars['ID']['input']>;
  customer_id_neq?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_neq?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id_neq?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_neq?: InputMaybe<Scalars['String']['input']>;
};

export type PayloadInput = {
  category: Scalars['String']['input'];
  configuration: Scalars['JSON']['input'];
  customer_id: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  satellite_id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type ReportFilter = {
  content?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_neq?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_gt?: InputMaybe<Scalars['Date']['input']>;
  date_gte?: InputMaybe<Scalars['Date']['input']>;
  date_lt?: InputMaybe<Scalars['Date']['input']>;
  date_lte?: InputMaybe<Scalars['Date']['input']>;
  date_neq?: InputMaybe<Scalars['Date']['input']>;
  employee_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id_neq?: InputMaybe<Scalars['ID']['input']>;
  groundStation_id?: InputMaybe<Scalars['ID']['input']>;
  groundStation_id_neq?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  q?: InputMaybe<Scalars['String']['input']>;
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id_neq?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_neq?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_neq?: InputMaybe<Scalars['String']['input']>;
};

export type ReportInput = {
  content: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  employee_id: Scalars['ID']['input'];
  groundStation_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type SatelliteFilter = {
  altitude?: InputMaybe<Scalars['Float']['input']>;
  altitude_gt?: InputMaybe<Scalars['Float']['input']>;
  altitude_gte?: InputMaybe<Scalars['Float']['input']>;
  altitude_lt?: InputMaybe<Scalars['Float']['input']>;
  altitude_lte?: InputMaybe<Scalars['Float']['input']>;
  altitude_neq?: InputMaybe<Scalars['Float']['input']>;
  busType?: InputMaybe<Scalars['String']['input']>;
  busType_gt?: InputMaybe<Scalars['String']['input']>;
  busType_gte?: InputMaybe<Scalars['String']['input']>;
  busType_lt?: InputMaybe<Scalars['String']['input']>;
  busType_lte?: InputMaybe<Scalars['String']['input']>;
  busType_neq?: InputMaybe<Scalars['String']['input']>;
  constellation_id?: InputMaybe<Scalars['ID']['input']>;
  constellation_id_neq?: InputMaybe<Scalars['ID']['input']>;
  coordinates?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  coordinates_neq?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_neq?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_neq?: InputMaybe<Scalars['ID']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  image?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_neq?: InputMaybe<Scalars['String']['input']>;
  launch_id?: InputMaybe<Scalars['ID']['input']>;
  launch_id_neq?: InputMaybe<Scalars['ID']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  manufacturer_gt?: InputMaybe<Scalars['String']['input']>;
  manufacturer_gte?: InputMaybe<Scalars['String']['input']>;
  manufacturer_lt?: InputMaybe<Scalars['String']['input']>;
  manufacturer_lte?: InputMaybe<Scalars['String']['input']>;
  manufacturer_neq?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_neq?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  specs?: InputMaybe<Scalars['JSON']['input']>;
  specs_neq?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_neq?: InputMaybe<Scalars['String']['input']>;
  tle?: InputMaybe<Scalars['JSON']['input']>;
  tle_neq?: InputMaybe<Scalars['JSON']['input']>;
};

export type SatelliteInput = {
  altitude: Scalars['Float']['input'];
  busType: Scalars['String']['input'];
  constellation_id?: InputMaybe<Scalars['ID']['input']>;
  coordinates: Array<InputMaybe<Scalars['Float']['input']>>;
  description: Scalars['String']['input'];
  image: Scalars['String']['input'];
  launch_id: Scalars['ID']['input'];
  manufacturer: Scalars['String']['input'];
  name: Scalars['String']['input'];
  specs: Scalars['JSON']['input'];
  status: Scalars['String']['input'];
  tle: Scalars['JSON']['input'];
};

export type ConstellationOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type ConstellationOverviewQuery = { __typename?: 'Query', allConstellations?: Array<{ __typename?: 'Constellation', id: string, name: string, description: string } | null> | null, allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string, status: string, altitude: number, constellation_id?: string | null } | null> | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, status: string, satellite_id: string } | null> | null };

export type ContactListQueryVariables = Exact<{ [key: string]: never; }>;


export type ContactListQuery = { __typename?: 'Query', allContacts?: Array<{ __typename?: 'Contact', id: string, date: string, type: string, satellite_id: string, groundStation_id: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, GroundStation?: { __typename?: 'GroundStation', id: string, name: string } | null } | null> | null };

export type ContactDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ContactDetailQuery = { __typename?: 'Query', Contact?: { __typename?: 'Contact', id: string, date: string, type: string, executionScript: string, configuration: unknown, satellite_id: string, groundStation_id: string, payload_id?: string | null, employee_id: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, GroundStation?: { __typename?: 'GroundStation', id: string, name: string } | null, Payload?: { __typename?: 'Payload', id: string, name: string } | null, Employee?: { __typename?: 'Employee', id: string, name: string } | null } | null };

export type CreateContactMutationVariables = Exact<{
  date: Scalars['Date']['input'];
  type: Scalars['String']['input'];
  executionScript: Scalars['String']['input'];
  configuration: Scalars['JSON']['input'];
  groundStation_id: Scalars['ID']['input'];
  satellite_id: Scalars['ID']['input'];
  payload_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id: Scalars['ID']['input'];
}>;


export type CreateContactMutation = { __typename?: 'Mutation', createContact?: { __typename?: 'Contact', id: string } | null };

export type UpdateContactMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  date?: InputMaybe<Scalars['Date']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  executionScript?: InputMaybe<Scalars['String']['input']>;
  configuration?: InputMaybe<Scalars['JSON']['input']>;
  groundStation_id?: InputMaybe<Scalars['ID']['input']>;
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  payload_id?: InputMaybe<Scalars['ID']['input']>;
  employee_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UpdateContactMutation = { __typename?: 'Mutation', updateContact?: { __typename?: 'Contact', id: string } | null };

export type CustomerListQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerListQuery = { __typename?: 'Query', allCustomers?: Array<{ __typename?: 'Customer', id: string, name: string, email: string, employee_id: string, Employee?: { __typename?: 'Employee', id: string, name: string, email: string, role: string } | null } | null> | null };

export type CustomerDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CustomerDetailQuery = { __typename?: 'Query', Customer?: { __typename?: 'Customer', id: string, name: string, email: string, employee_id: string, Employee?: { __typename?: 'Employee', id: string, name: string, email: string, role: string } | null } | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, status: string, category: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null } | null> | null };

export type FleetOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type FleetOverviewQuery = { __typename?: 'Query', allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string, status: string } | null> | null, allGroundStations?: Array<{ __typename?: 'GroundStation', id: string, name: string, status: string, network: string } | null> | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, status: string } | null> | null, allContacts?: Array<{ __typename?: 'Contact', id: string, date: string } | null> | null, allReports?: Array<{ __typename?: 'Report', id: string, title: string, type: string, date: string } | null> | null, _allSatellitesMeta?: { __typename?: 'ListMetadata', count?: number | null } | null, _allGroundStationsMeta?: { __typename?: 'ListMetadata', count?: number | null } | null, _allPayloadsMeta?: { __typename?: 'ListMetadata', count?: number | null } | null };

export type FleetMapQueryVariables = Exact<{ [key: string]: never; }>;


export type FleetMapQuery = { __typename?: 'Query', allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string, status: string, coordinates: Array<number | null>, tle: unknown } | null> | null, allGroundStations?: Array<{ __typename?: 'GroundStation', id: string, name: string, status: string, coordinates: Array<number | null> } | null> | null };

export type MapContactPlannerDataQueryVariables = Exact<{ [key: string]: never; }>;


export type MapContactPlannerDataQuery = { __typename?: 'Query', allEmployees?: Array<{ __typename?: 'Employee', id: string, name: string } | null> | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, satellite_id: string } | null> | null, allContacts?: Array<{ __typename?: 'Contact', id: string, date: string, satellite_id: string, groundStation_id: string } | null> | null };

export type PayloadListQueryVariables = Exact<{ [key: string]: never; }>;


export type PayloadListQuery = { __typename?: 'Query', allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, status: string, category: string, satellite_id: string, customer_id: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, Customer?: { __typename?: 'Customer', id: string, name: string } | null } | null> | null, allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string } | null> | null, allCustomers?: Array<{ __typename?: 'Customer', id: string, name: string } | null> | null };

export type PayloadDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PayloadDetailQuery = { __typename?: 'Query', Payload?: { __typename?: 'Payload', id: string, name: string, description: string, status: string, category: string, configuration: unknown, satellite_id: string, customer_id: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, Customer?: { __typename?: 'Customer', id: string, name: string } | null } | null };

export type ReportListQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportListQuery = { __typename?: 'Query', allReports?: Array<{ __typename?: 'Report', id: string, title: string, type: string, date: string, satellite_id?: string | null, groundStation_id?: string | null, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, GroundStation?: { __typename?: 'GroundStation', id: string, name: string } | null } | null> | null };

export type ReportDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReportDetailQuery = { __typename?: 'Query', Report?: { __typename?: 'Report', id: string, title: string, type: string, date: string, content: string, satellite_id?: string | null, groundStation_id?: string | null, employee_id: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, GroundStation?: { __typename?: 'GroundStation', id: string, name: string } | null, Employee?: { __typename?: 'Employee', id: string, name: string } | null } | null, allComments?: Array<{ __typename?: 'Comment', id: string, date: string, content: string, employee_id: string, Employee?: { __typename?: 'Employee', id: string, name: string } | null } | null> | null };

export type CreateReportMutationVariables = Exact<{
  type: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  title: Scalars['String']['input'];
  content: Scalars['String']['input'];
  employee_id: Scalars['ID']['input'];
  satellite_id?: InputMaybe<Scalars['ID']['input']>;
  groundStation_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateReportMutation = { __typename?: 'Mutation', createReport?: { __typename?: 'Report', id: string } | null };

export type CreateCommentMutationVariables = Exact<{
  date: Scalars['Date']['input'];
  content: Scalars['String']['input'];
  report_id: Scalars['ID']['input'];
  employee_id: Scalars['ID']['input'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment?: { __typename?: 'Comment', id: string } | null };

export type SatelliteListQueryVariables = Exact<{ [key: string]: never; }>;


export type SatelliteListQuery = { __typename?: 'Query', allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string, status: string, manufacturer: string, busType: string, image: string } | null> | null };

export type SatelliteDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SatelliteDetailQuery = { __typename?: 'Query', Satellite?: { __typename?: 'Satellite', id: string, name: string, description: string, status: string, manufacturer: string, busType: string, image: string, coordinates: Array<number | null>, altitude: number, specs: unknown, tle: unknown, Launch?: { __typename?: 'Launch', id: string, date: string, provider: string, status: string, outcome?: string | null, rocket: string } | null, Constellation?: { __typename?: 'Constellation', id: string, name: string } | null } | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, description: string, category: string, status: string } | null> | null };

export type GlobalSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalSearchQuery = { __typename?: 'Query', allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string, status: string, manufacturer: string } | null> | null, allGroundStations?: Array<{ __typename?: 'GroundStation', id: string, name: string, status: string, network: string } | null> | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, status: string, category: string } | null> | null, allCustomers?: Array<{ __typename?: 'Customer', id: string, name: string, email: string } | null> | null, allContacts?: Array<{ __typename?: 'Contact', id: string, date: string, type: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null, GroundStation?: { __typename?: 'GroundStation', id: string, name: string } | null } | null> | null, allReports?: Array<{ __typename?: 'Report', id: string, title: string, type: string, date: string } | null> | null };

export type StationListQueryVariables = Exact<{ [key: string]: never; }>;


export type StationListQuery = { __typename?: 'Query', allGroundStations?: Array<{ __typename?: 'GroundStation', id: string, name: string, status: string, network: string, image: string } | null> | null };

export type StationDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StationDetailQuery = { __typename?: 'Query', GroundStation?: { __typename?: 'GroundStation', id: string, name: string, image: string, coordinates: Array<number | null>, network: string, status: string } | null, allContacts?: Array<{ __typename?: 'Contact', id: string, date: string, type: string, Satellite?: { __typename?: 'Satellite', id: string, name: string } | null } | null> | null, allReports?: Array<{ __typename?: 'Report', id: string, date: string, title: string, type: string } | null> | null };

export type FormEntityOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FormEntityOptionsQuery = { __typename?: 'Query', allSatellites?: Array<{ __typename?: 'Satellite', id: string, name: string } | null> | null, allGroundStations?: Array<{ __typename?: 'GroundStation', id: string, name: string } | null> | null, allEmployees?: Array<{ __typename?: 'Employee', id: string, name: string } | null> | null, allPayloads?: Array<{ __typename?: 'Payload', id: string, name: string, satellite_id: string } | null> | null };


export const ConstellationOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConstellationOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allConstellations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"altitude"}},{"kind":"Field","name":{"kind":"Name","value":"constellation_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}}]}}]}}]} as unknown as DocumentNode<ConstellationOverviewQuery, ConstellationOverviewQueryVariables>;
export const ContactListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContactList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"groundStation_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ContactListQuery, ContactListQueryVariables>;
export const ContactDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContactDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Contact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"executionScript"}},{"kind":"Field","name":{"kind":"Name","value":"configuration"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"groundStation_id"}},{"kind":"Field","name":{"kind":"Name","value":"payload_id"}},{"kind":"Field","name":{"kind":"Name","value":"employee_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Payload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ContactDetailQuery, ContactDetailQueryVariables>;
export const CreateContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionScript"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"configuration"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionScript"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionScript"}}},{"kind":"Argument","name":{"kind":"Name","value":"configuration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"configuration"}}},{"kind":"Argument","name":{"kind":"Name","value":"groundStation_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"satellite_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"payload_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"employee_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateContactMutation, CreateContactMutationVariables>;
export const UpdateContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionScript"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"configuration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionScript"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionScript"}}},{"kind":"Argument","name":{"kind":"Name","value":"configuration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"configuration"}}},{"kind":"Argument","name":{"kind":"Name","value":"groundStation_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"satellite_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"payload_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"employee_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateContactMutation, UpdateContactMutationVariables>;
export const CustomerListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"employee_id"}},{"kind":"Field","name":{"kind":"Name","value":"Employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<CustomerListQuery, CustomerListQueryVariables>;
export const CustomerDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomerDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"employee_id"}},{"kind":"Field","name":{"kind":"Name","value":"Employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"customer_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CustomerDetailQuery, CustomerDetailQueryVariables>;
export const FleetOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FleetOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allGroundStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_allSatellitesMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_allGroundStationsMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_allPayloadsMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<FleetOverviewQuery, FleetOverviewQueryVariables>;
export const FleetMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FleetMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"tle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allGroundStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}}]} as unknown as DocumentNode<FleetMapQuery, FleetMapQueryVariables>;
export const MapContactPlannerDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MapContactPlannerData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEmployees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"groundStation_id"}}]}}]}}]} as unknown as DocumentNode<MapContactPlannerDataQuery, MapContactPlannerDataQueryVariables>;
export const PayloadListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PayloadList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<PayloadListQuery, PayloadListQueryVariables>;
export const PayloadDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PayloadDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Payload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"configuration"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PayloadDetailQuery, PayloadDetailQueryVariables>;
export const ReportListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReportList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"groundStation_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ReportListQuery, ReportListQueryVariables>;
export const ReportDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReportDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}},{"kind":"Field","name":{"kind":"Name","value":"groundStation_id"}},{"kind":"Field","name":{"kind":"Name","value":"employee_id"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"report_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"employee_id"}},{"kind":"Field","name":{"kind":"Name","value":"Employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ReportDetailQuery, ReportDetailQueryVariables>;
export const CreateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"employee_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"satellite_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"satellite_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"groundStation_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groundStation_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateReportMutation, CreateReportMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"report_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"report_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"report_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"employee_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"employee_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const SatelliteListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SatelliteList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"busType"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<SatelliteListQuery, SatelliteListQueryVariables>;
export const SatelliteDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SatelliteDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"busType"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"altitude"}},{"kind":"Field","name":{"kind":"Name","value":"specs"}},{"kind":"Field","name":{"kind":"Name","value":"tle"}},{"kind":"Field","name":{"kind":"Name","value":"Launch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"rocket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Constellation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"satellite_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<SatelliteDetailQuery, SatelliteDetailQueryVariables>;
export const GlobalSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allGroundStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const StationListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StationList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allGroundStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<StationListQuery, StationListQueryVariables>;
export const StationDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StationDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroundStation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"groundStation_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"Satellite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"groundStation_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<StationDetailQuery, StationDetailQueryVariables>;
export const FormEntityOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormEntityOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSatellites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allGroundStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allEmployees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPayloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"satellite_id"}}]}}]}}]} as unknown as DocumentNode<FormEntityOptionsQuery, FormEntityOptionsQueryVariables>;