<?php
/**
 * Copyright Zikula Foundation 2009 - Zikula Application Framework
 *
 * This work is contributed to the Zikula Foundation under one or more
 * Contributor Agreements and licensed to You under the following license:
 *
 * @license GNU/LGPLv3 (or at your option, any later version).
 * @package Zikula
 *
 * Please see the NOTICE file distributed with this source code for further
 * information regarding copyright and licensing.
 */

namespace SecurityCenterModule\Controller;

use SecurityUtil, LogUtil, ModUtil;

class AdminformController extends \Zikula\Framework\Controller\AbstractController
{
    /**
     * Initialise.
     *
     * @return void
     */
    protected function initialize()
    {
        // Do not setup a view pfor this controller.
    }

    /**
     * Function to delete an ids log entry
     */
    public function deleteidsentryAction()
    {
        // verify auth-key
        $csrftoken = $this->request->get('csrftoken');
        $this->checkCsrfToken($csrftoken);

        // Security check
        if (!SecurityUtil::checkPermission('SecurityCenter::', '::', ACCESS_DELETE)) {
            throw new \Zikula\Framework\Exception\ForbiddenException();
        }

        // get paramters
        $id = (int)$this->request->get('id', 0);

        // sanity check
        if (!is_numeric($id)) {
            return LogUtil::registerError($this->__f("Error! Received a non-numeric object ID '%s'.", $id));
        }

        $intrusion = $this->entityManager->find('SecurityCenterModule\Entity\Intrusion', $id);

        // check for valid object
        if (!$intrusion) {
            return LogUtil::registerError($this->__f('Error! Invalid %s received.', "object ID [$id]"));
        } else {
            // delete object
            $this->entityManager->remove($intrusion);
            $this->entityManager->flush();
        }

        // redirect back to view function
        return $this->redirect(ModUtil::url('SecurityCenter', 'admin', 'viewidslog'));
    }
}
