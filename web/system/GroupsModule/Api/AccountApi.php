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

namespace GroupsModule\Api;

use ModUtil;

class AccountApi extends \Zikula\Framework\Api\AbstractApi
{
    /**
     * Return an array of items to show in the your account panel
     *
     * @return array indexed array of items
     */
    public function getall()
    {
        $items = array();

        // Check if there is at least one group to show
        $groups = ModUtil::apiFunc('GroupsModule', 'user', 'getallgroups');

        if ($groups) {
            // create an array of links to return
            $items['0'] = array(
                'url'    => ModUtil::url('Groups', 'user', 'index'),
                'module' => 'Groups',
                'title'  => $this->__('Groups manager'),
                'icon'   => 'admin.png');
        }

        // Return the items
        return $items;
    }
}
