"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
    useState,
    type BaseSyntheticEvent,
    type ChangeEvent,
    type ComponentProps,
} from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import {
    ContactSchema,
    sanitizeName,
    sanitizePhone,
    type ContactField,
    type ContactFormValues,
    type ContactInput,
} from "@/actions/contact/schema";
import { sendContact } from "@/actions/contact/send-contact";
import { contact } from "@/content/contact";
import { cn } from "@/lib/utils";

const FIELD_ORDER: ContactField[] = ["name", "email", "phone", "company", "message", "privacy"];

const DEFAULT_VALUES: ContactFormValues = {
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    privacy: false,
    website: "",
};

const controlBase =
    "bg-surface w-full scroll-mt-28 rounded-sm border px-4 text-base text-white transition duration-150 placeholder:text-white/50 focus:ring-2 focus:outline-none motion-reduce:transition-none";
const controlValid = "focus:border-accent-light focus:ring-accent/40 border-white/40";
const errorAppear = "transition duration-200 motion-reduce:transition-none starting:-translate-y-1 starting:opacity-0";
const controlInvalid = "border-danger focus:border-danger focus:ring-danger/40";

type TextFieldName = keyof typeof contact.form.fields;

type TextFieldProps = {
    name: TextFieldName;
    registration: UseFormRegisterReturn<TextFieldName>;
    error?: string;
    className?: string;
} & (
    ({ multiline?: false } & Pick<ComponentProps<"input">, "type" | "autoComplete" | "inputMode">) | { multiline: true }
);

function TextField({ name, registration, error, className, ...props }: TextFieldProps) {
    const id = useId();
    const inputId = `${id}-${name}`;
    const errorId = `${inputId}-error`;
    const field = contact.form.fields[name];
    const controlProps = {
        id: inputId,
        placeholder: field.placeholder,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        ...registration,
    };
    const controlClassName = cn(controlBase, error ? controlInvalid : controlValid);

    return (
        <div className={className}>
            <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white/85">
                {field.label}
                {"optional" in field && field.optional && (
                    <span className="text-white/50"> {contact.form.optionalLabel}</span>
                )}
            </label>
            {props.multiline ? (
                <textarea {...controlProps} className={cn(controlClassName, "block min-h-40 resize-y py-3")} />
            ) : (
                <input
                    {...controlProps}
                    type={props.type}
                    autoComplete={props.autoComplete}
                    inputMode={props.inputMode}
                    className={cn(controlClassName, "h-12")}
                />
            )}
            {error && (
                <p id={errorId} className={cn("text-danger mt-1.5 text-sm", errorAppear)}>
                    {error}
                </p>
            )}
        </div>
    );
}

function Spinner() {
    return (
        <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
        />
    );
}

type SuccessPanelProps = {
    minHeight?: number;
    onReset: () => void;
};

function SuccessPanel({ minHeight, onReset }: SuccessPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    return (
        <div
            ref={panelRef}
            role="status"
            tabIndex={-1}
            style={{ minHeight }}
            className="bg-surface border-accent/40 flex scroll-mt-28 flex-col items-center justify-center rounded-sm border p-10 text-center transition duration-500 ease-out-soft focus:outline-none motion-reduce:transition-none starting:translate-y-2 starting:opacity-0"
        >
            <span
                aria-hidden="true"
                className="bg-accent flex size-14 items-center justify-center rounded-full transition delay-150 duration-500 ease-out-soft motion-reduce:transition-none starting:scale-50 starting:opacity-0"
            >
                <CheckCircle size={28} strokeWidth={2} className="text-white" />
            </span>
            <p className="mt-6 text-xl font-semibold text-white">{contact.success.message}</p>
            <button
                type="button"
                onClick={onReset}
                className="mt-3 inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-white/70 underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
                {contact.success.resetLabel}
            </button>
        </div>
    );
}

export function ContactForm() {
    const focusFormOnShow = useRef(false);
    const [submitted, setSubmitted] = useState(false);
    const [panelHeight, setPanelHeight] = useState<number>();
    const [generalError, setGeneralError] = useState(false);
    const privacyId = useId();
    const privacyErrorId = `${privacyId}-error`;
    const honeypotId = useId();
    const { form } = contact;

    const {
        register,
        handleSubmit,
        setError,
        setFocus,
        setValue,
        reset,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<ContactFormValues, unknown, ContactInput>({
        resolver: zodResolver(ContactSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (submitted || !focusFormOnShow.current) return;
        focusFormOnShow.current = false;
        setFocus("name");
    }, [submitted, setFocus]);

    const sanitizeOnChange =
        (field: "name" | "phone", sanitize: (value: string) => string) => (event: ChangeEvent<HTMLInputElement>) => {
            const sanitized = sanitize(event.target.value);
            if (sanitized === event.target.value) return;
            setValue(field, sanitized, { shouldValidate: isSubmitted });
        };

    const onSubmit = async (values: ContactInput, event?: BaseSyntheticEvent) => {
        const formHeight = event?.target instanceof HTMLFormElement ? event.target.offsetHeight : undefined;
        setGeneralError(false);
        try {
            const result = await sendContact(values);
            if (result.success) {
                setPanelHeight(formHeight);
                setSubmitted(true);
                return;
            }

            const fieldErrors = result.reason === "validation" ? result.errors : {};
            const invalidFields = FIELD_ORDER.filter((field) => fieldErrors[field]?.[0]);
            if (invalidFields.length === 0) {
                setGeneralError(true);
                return;
            }
            invalidFields.forEach((field, index) => {
                setError(field, { message: fieldErrors[field]?.[0] }, { shouldFocus: index === 0 });
            });
        } catch {
            setGeneralError(true);
        }
    };

    const handleReset = () => {
        reset(DEFAULT_VALUES);
        setGeneralError(false);
        focusFormOnShow.current = true;
        setSubmitted(false);
    };

    if (submitted) return <SuccessPanel minHeight={panelHeight} onReset={handleReset} />;

    const privacyError = errors.privacy?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid grid-cols-1 gap-5 md:grid-cols-2">
            <TextField
                name="name"
                type="text"
                autoComplete="name"
                registration={register("name", { onChange: sanitizeOnChange("name", sanitizeName) })}
                error={errors.name?.message}
            />
            <TextField
                name="email"
                type="email"
                autoComplete="email"
                registration={register("email")}
                error={errors.email?.message}
            />
            <TextField
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                registration={register("phone", { onChange: sanitizeOnChange("phone", sanitizePhone) })}
                error={errors.phone?.message}
            />
            <TextField
                name="company"
                type="text"
                autoComplete="organization"
                registration={register("company")}
                error={errors.company?.message}
            />
            <TextField
                name="message"
                multiline
                registration={register("message")}
                error={errors.message?.message}
                className="md:col-span-2"
            />

            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor={honeypotId}>{form.honeypotLabel}</label>
                <input id={honeypotId} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="md:col-span-2">
                <div className="-my-3 flex min-h-11 items-center gap-3">
                    <input
                        id={privacyId}
                        type="checkbox"
                        aria-invalid={privacyError ? true : undefined}
                        aria-describedby={privacyError ? privacyErrorId : undefined}
                        className="accent-accent focus-visible:outline-accent size-5 scroll-mt-28 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
                        {...register("privacy")}
                    />
                    <label htmlFor={privacyId} className="py-3 text-sm leading-5 text-white/75">
                        {form.privacy.before}
                        <a
                            href="/aviso-de-privacidad"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-sm underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            {form.privacy.linkLabel}
                            <span className="sr-only"> {form.privacy.newTabNotice}</span>
                        </a>
                        {form.privacy.after}
                    </label>
                </div>
                {privacyError && (
                    <p id={privacyErrorId} className={cn("text-danger mt-1.5 text-sm", errorAppear)}>
                        {privacyError}
                    </p>
                )}
            </div>

            <div className="md:col-span-2">
                {generalError && (
                    <p role="alert" className={cn("text-danger mb-5 text-sm", errorAppear)}>
                        {form.generalError}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:enabled:bg-accent-hover inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-[0.05em] text-white uppercase transition duration-200 hover:enabled:-translate-y-px active:enabled:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:enabled:translate-y-0 sm:w-auto"
                >
                    {isSubmitting && <Spinner />}
                    {isSubmitting ? form.submit.loadingLabel : form.submit.label}
                </button>
            </div>
        </form>
    );
}
