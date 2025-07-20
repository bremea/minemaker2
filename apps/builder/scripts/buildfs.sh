#!/bin/bash

set -e

TAR_PATH="$1"

if [[ -z "$TAR_PATH" ]]; then
    echo "missing tar path" >&2
    exit 1
fi

if [[ ! -f "$TAR_PATH" ]]; then
    echo "file not found: $TAR_PATH" >&2
    exit 1
fi

WORKDIR=$(mktemp -d)
IMG_PATH="${TAR_PATH%.tar}.img"

# create image
dd if=/dev/zero of="$IMG_PATH" bs=1M count=512 status=none
mkfs.ext4 -F "$IMG_PATH" > /dev/null

MOUNT_DIR="$WORKDIR/mnt"
mkdir -p "$MOUNT_DIR"

if command -v fuse2fs > /dev/null; then
    fuse2fs "$IMG_PATH" "$MOUNT_DIR"
    elif command -v guestmount > /dev/null; then
    guestmount -a "$IMG_PATH" -m /dev/sda --rw "$MOUNT_DIR"
else
    echo "fuse2fs or guestmount missing?" >&2
    exit 1
fi

# extract tarball contents
tar -xf "$TAR_PATH" -C "$MOUNT_DIR"

# clean up
fusermount -u "$MOUNT_DIR"
rm -rf "$WORKDIR"

echo "$IMG_PATH"