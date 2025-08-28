-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "perfilPhoto" TEXT,
    "birthDay" INTEGER,
    "birthMonth" INTEGER,
    "birthYear" INTEGER,
    "phone" TEXT,
    "contactEmail" TEXT,
    "contactNames" TEXT,
    "contactLastnames" TEXT,
    "contactPhone" TEXT,
    "sex" TEXT,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "idProfessional" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
