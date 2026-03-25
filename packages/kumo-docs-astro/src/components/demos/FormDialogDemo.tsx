import { useState } from "react";
import { FormDialog } from "../kumo/form-dialog/form-dialog";
import {
  Button,
  Input,
  Banner,
  Text,
  Select,
  ClipboardText,
  Surface,
  Label,
} from "@cloudflare/kumo";
import { InfoIcon } from "@phosphor-icons/react";

/** Small dialog for a single short input — use when the form has one field or is text-only */
export function FormDialogSmDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setName("");
    setOpen(false);
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Create a group
      </Button>
      <FormDialog
        size="sm"
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Create a group"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!name.trim()}
        submitButtonText="Create"
      >
        <Input
          label="Name"
          placeholder="my-group"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormDialog>
    </>
  );
}

type InstallStep = { title: string; command: string };

const INSTALL_STEPS: Record<string, InstallStep[]> = {
  "linux-x86-64": [
    {
      title: "Install cloudflared",
      command:
        "curl -L -o cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64",
    },
    { title: "Install service", command: "sudo cloudflared service install" },
  ],
  "linux-arm64": [
    {
      title: "Install cloudflared",
      command:
        "curl -L -o cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64",
    },
    { title: "Install service", command: "sudo cloudflared service install" },
  ],
  "macos-x86-64": [
    {
      title: "Install cloudflared",
      command: "brew install cloudflare/cloudflare/cloudflared",
    },
    { title: "Run service", command: "sudo cloudflared service install" },
  ],
  "macos-arm64": [
    {
      title: "Install cloudflared",
      command: "arch -arm64 brew install cloudflare/cloudflare/cloudflared",
    },
    { title: "Run service", command: "sudo cloudflared service install" },
  ],
};

/** Create tunnel dialog — OS/architecture selectors with dynamic installation instructions */
export function FormDialogComplexDemo() {
  const [open, setOpen] = useState(false);
  const [os, setOs] = useState("linux");
  const [arch, setArch] = useState("x86-64");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const installSteps = INSTALL_STEPS[`${os}-${arch}`] ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setOs("linux");
    setArch("x86-64");
    setOpen(false);
  };

  const handleClose = () => {
    setOs("linux");
    setArch("x86-64");
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Create Tunnel
      </Button>
      <FormDialog
        size="base"
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Create Tunnel"
        description="Connect your infrastructure to Cloudflare's network."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create"
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              label="Operating system"
              value={os}
              onValueChange={(v) => {
                if (v) {
                  setOs(v);
                  setArch("x86-64");
                }
              }}
              className="w-full"
            >
              <Select.Option value="linux">Linux</Select.Option>
              <Select.Option value="macos">macOS</Select.Option>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              label="Architecture"
              value={arch}
              onValueChange={(v) => {
                if (v) setArch(v);
              }}
              className="w-full"
            >
              <Select.Option value="x86-64">x86-64</Select.Option>
              <Select.Option value="arm64">ARM64</Select.Option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>Installation</Label>
            <Text variant="secondary" size="sm">
              Run this command to install the connector on your machine.
            </Text>
          </div>
          <Surface className="p-3 rounded-lg flex bg-kumo-elevated flex-col gap-3">
            {installSteps.map((step) => (
              <div key={step.title} className="flex flex-col gap-2">
                <Text variant="secondary" size="xs">
                  {step.title}
                </Text>
                <ClipboardText text={step.command} />
              </div>
            ))}
          </Surface>
        </div>
      </FormDialog>
    </>
  );
}

/** Basic add CIDR route dialog */
export function FormDialogBasicDemo() {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setNetwork("");
    setComment("");
    setOpen(false);
  };

  const handleClose = () => {
    setNetwork("");
    setComment("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Add CIDR Route
      </Button>
      <FormDialog
        size="base"
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Add CIDR Route"
        description="Define a private network range accessible through your tunnel."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!network.trim()}
        submitButtonText="Add Route"
      >
        <Input
          label="Network CIDR"
          labelTooltip="Use CIDR notation, e.g. 10.0.0.0/24 for a /24 block."
          placeholder="10.0.0.0/24"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        />
        <Input
          label="Comment"
          placeholder="Office network"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required={false}
        />
      </FormDialog>
    </>
  );
}

/** Form dialog with an info banner */
export function FormDialogWithBannerDemo() {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setNetwork("");
    setComment("");
    setOpen(false);
  };

  const handleClose = () => {
    setNetwork("");
    setComment("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Add CIDR
      </Button>
      <FormDialog
        size="base"
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Add Private Network"
        description="Define a private network range accessible through your tunnel."
        banner={
          <Banner
            variant="default"
            icon={<InfoIcon weight="fill" />}
            description="A Cloudflare Gateway or WARP client is required to route traffic to private networks."
          />
        }
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!network.trim()}
        submitButtonText="Add Network"
      >
        <Input
          label="Network (CIDR)"
          placeholder="10.0.0.0/24"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        />
        <Input
          label="Comment"
          placeholder="Office network"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required={false}
        />
      </FormDialog>
    </>
  );
}

/** Form dialog with an error message */
export function FormDialogErrorDemo() {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setError("The CIDR route 10.0.0.0/24 overlaps with an existing route.");
  };

  const handleClose = () => {
    setNetwork("");
    setComment("");
    setError("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Add CIDR Route
      </Button>
      <FormDialog
        size="base"
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Add CIDR Route"
        description="Define a private network range accessible through your tunnel."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!network.trim()}
        submitButtonText="Add Route"
        errorMessage={error || undefined}
      >
        <Input
          label="Network (CIDR)"
          placeholder="10.0.0.0/24"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        />
        <Input
          label="Comment"
          placeholder="Office network"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required={false}
        />
      </FormDialog>
    </>
  );
}
