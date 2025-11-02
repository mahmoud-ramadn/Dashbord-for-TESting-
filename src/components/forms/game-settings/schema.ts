import { z } from "zod"

export const GameSettingFormSchema = z.object({
    easyPoints: z.number().min(2, { message: "عدد النقاط للمستوى السهل يجب أن يكون أكبر من 1" }),
    mediumPoints: z.number().min(2, { message: "عدد النقاط للمستوى المتوسط يجب أن يكون أكبر من 1" }),
    hardPoints: z.number().min(2, { message: "عدد النقاط للمستوى الصعب يجب أن يكون أكبر من 1" }),
    timePerQuestionSeconds: z.number().min(10, { message: "الوقت لكل سؤال يجب أن يكون على الأقل 10 ثوانٍ" }),
    timeExtensionSeconds: z.number().min(10, { message: "وقت التمديد يجب أن يكون على الأقل 10 ثوانٍ" }),
})

export type GameSettingFormSchemaType = z.infer<typeof GameSettingFormSchema>
