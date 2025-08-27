# Database Setup for NER Dataset Tagger

This application now uses **SQLite** with **Prisma ORM** for persistent storage of NER datasets, samples, and entities.

## Database Architecture

### Tables

1. **`datasets`** - Stores dataset metadata
   - `id` (unique identifier)
   - `name` (dataset name)
   - `description` (dataset description)
   - `createdAt` (creation timestamp)
   - `updatedAt` (last update timestamp)

2. **`samples`** - Stores text samples for annotation
   - `id` (unique identifier)
   - `text` (the actual text content)
   - `datasetId` (foreign key to datasets table)
   - `createdAt` (creation timestamp)
   - `updatedAt` (last update timestamp)

3. **`entities`** - Stores annotated entities
   - `id` (unique identifier)
   - `text` (the annotated text span)
   - `type` (entity type: PERSON, ORGANIZATION, LOCATION, etc.)
   - `start` (character position start)
   - `end` (character position end)
   - `sampleId` (foreign key to samples table)
   - `createdAt` (creation timestamp)

### Relationships

```
Dataset (1) ←→ (many) Sample (1) ←→ (many) Entity
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install prisma @prisma/client sqlite3
```

### 2. Initialize Prisma

```bash
npx prisma init --datasource-provider sqlite
```

### 3. Configure Database URL

Create or update `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Create Database Tables

```bash
npx prisma db push
```

## Database Operations

### Creating a Dataset

```typescript
const dataset = await databaseService.createDataset('My Dataset', 'Description')
```

### Adding a Sample

```typescript
const sample = await databaseService.createSample(datasetId, 'Text content')
```

### Updating a Sample with Entities

```typescript
const entities = [
  { text: 'John', type: 'PERSON', start: 0, end: 4 },
  { text: 'Microsoft', type: 'ORGANIZATION', start: 10, end: 19 }
]
await databaseService.updateSample(sampleId, 'Updated text', entities)
```

### Getting Statistics

```typescript
const stats = await databaseService.getDatasetStats()
// Returns: { totalDatasets: number, totalSamples: number, totalEntities: number }
```

## Database Service

The `DatabaseService` class provides a clean interface for all database operations:

- **Dataset operations**: create, read, update, delete
- **Sample operations**: create, update, delete
- **Entity operations**: add, remove
- **Utility methods**: statistics, data export

## Testing the Database

Run the test script to verify database functionality:

```bash
node scripts/test-db.js
```

This will:
1. Create a test dataset
2. Add a sample text
3. Create test entities
4. Verify data persistence
5. Display database statistics

## Data Persistence

- **SQLite database file**: `prisma/dev.db`
- **Automatic backups**: Consider backing up this file regularly
- **Cross-platform**: SQLite works on Windows, macOS, and Linux
- **No server required**: Database runs locally with the application

## Migration and Schema Changes

To modify the database schema:

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to update the client

## Production Considerations

For production use, consider:

1. **PostgreSQL**: More robust for concurrent users
2. **Database backups**: Regular automated backups
3. **Connection pooling**: For high-traffic applications
4. **Environment variables**: Secure database credentials

## Troubleshooting

### Common Issues

1. **Database locked**: Close any other applications using the database
2. **Schema mismatch**: Run `npx prisma db push` to sync schema
3. **Client out of sync**: Run `npx prisma generate` after schema changes

### Reset Database

To completely reset the database:

```bash
rm prisma/dev.db
npx prisma db push
```

This will recreate all tables with the current schema.
