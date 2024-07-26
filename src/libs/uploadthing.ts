import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouterT } from "@/app/api/uploadthing/core";

export const { uploadFiles, useUploadThing } = generateReactHelpers<OurFileRouterT>();
