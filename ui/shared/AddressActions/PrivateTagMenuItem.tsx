import { MenuItem, chakra, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import useRedirectIfNotAuth from 'lib/hooks/useRedirectIfNotAuth';
import PrivateTagModal from 'ui/privateTags/AddressModal/AddressModal';

interface Props {
  className?: string;
  hash: string;
}

const PrivateTagMenuItem = ({ className, hash }: Props) => {
  const modal = useDisclosure();
  const queryClient = useQueryClient();
  const redirectIfNotAuth = useRedirectIfNotAuth();

  const queryKey = getResourceKey('address', { pathParams: { hash } });
  const addressData = queryClient.getQueryData<Address>(queryKey);

  const handleClick = React.useCallback(() => {
    if (redirectIfNotAuth()) {
      return;
    }

    modal.onOpen();
  }, [ modal, redirectIfNotAuth ]);

  const handleAddPrivateTag = React.useCallback(async() => {
    await queryClient.refetchQueries({ queryKey });
    modal.onClose();
  }, [ queryClient, queryKey, modal ]);

  const formData = React.useMemo(() => {
    return {
      address_hash: hash,
    };
  }, [ hash ]);

  if (addressData?.private_tags?.length) {
    return null;
  }

  return (
    <>
      <MenuItem className={ className }onClick={ handleClick }>
        Add private tag
      </MenuItem>
      <PrivateTagModal isOpen={ modal.isOpen } onClose={ modal.onClose } onSuccess={ handleAddPrivateTag } data={ formData }/>
    </>
  );
};

export default React.memo(chakra(PrivateTagMenuItem));
