-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_member_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_team_fkey";

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_fkey" FOREIGN KEY ("team") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_fkey" FOREIGN KEY ("member") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
