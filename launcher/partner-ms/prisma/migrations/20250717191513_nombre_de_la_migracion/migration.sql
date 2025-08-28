-- CreateTable
CREATE TABLE "Prepagadas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SpecialistStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Prepagadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PrepagadasToUserDataPartner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PrepagadasToUserDataPartner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prepagadas_name_key" ON "Prepagadas"("name");

-- CreateIndex
CREATE INDEX "_PrepagadasToUserDataPartner_B_index" ON "_PrepagadasToUserDataPartner"("B");

-- AddForeignKey
ALTER TABLE "_PrepagadasToUserDataPartner" ADD CONSTRAINT "_PrepagadasToUserDataPartner_A_fkey" FOREIGN KEY ("A") REFERENCES "Prepagadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrepagadasToUserDataPartner" ADD CONSTRAINT "_PrepagadasToUserDataPartner_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDataPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
