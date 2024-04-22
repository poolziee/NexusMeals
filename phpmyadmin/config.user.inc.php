<?php
  $i++;
  $cfg['Servers'][$i]['verbose'] = 'users';
  $cfg['Servers'][$i]['host'] = 'users-db';
  $cfg['Servers'][$i]['port'] = '';
  $cfg['Servers'][$i]['socket'] = '';
  $cfg['Servers'][$i]['connect_type'] = 'tcp';
  $cfg['Servers'][$i]['extension'] = 'mysqli';
  $cfg['Servers'][$i]['auth_type'] = 'config';
  $cfg['Servers'][$i]['user'] = 'root';
  $cfg['Servers'][$i]['password'] = 'admin';
  $cfg['Servers'][$i]['AllowNoPassword'] = false;
  ?>